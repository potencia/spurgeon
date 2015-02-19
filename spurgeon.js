'use strict';

var config = require('./spurgeon.json'),
Q = require('q'),
MongoClient = require('mongodb').MongoClient,
REPL = require('./lib/repl'),
MultiPrompt = require('./lib/multi-prompt'),
Reference = require('./lib/reference');

function Spurgeon () {
    this.root = [];
    this.currentList = this.root;
    this.position = [0];
}

function customExit (session) {
    var realExit = session.commands['.exit'].action;
    session.commands['.exit'].action = function () {
        console.log('Attempting to log off of the db. Please wait...');
        Q.ninvoke(session.context.db,'close')
        .delay(2000).then(function () {
            delete session.context.db;
            process.exit();
        });
    }
}

function buildOperations (context, db) {
    var spurgeon = new Spurgeon(),
    pointRequest, passageRequest, inputChapterRequest,
    endTag = '@@END@@';

    context.__defineGetter__('Q', function () {
        return Q;
    });

    context.__defineGetter__('db', function () {
        return db;
    });

    context.__defineGetter__('root', function () {
        return spurgeon.root;
    });

    context.__defineGetter__('dump', function () {
        console.log(JSON.stringify(spurgeon.root, null, 2));
    });

    context.__defineGetter__('neededChapters', function neededChapters () {
        if (!neededChapters.list || neededChapters.list.length === 0) {
            var books = {};
            return Q.ninvoke(db.collection('verses'),'find',{version:'KJV',text:{$exists:false}},{fields:{book:1,chapter:1}})
            .then(function (cursor) {
                function onNext(next) {
                    if (!next) return;
                    if (Object.prototype.toString.call(next) === '[object Object]') {
                        if (!books[next.book]) books[next.book]={};
                        books[next.book][next.chapter] = true;
                    }
                    return Q.ninvoke(cursor, 'nextObject').then(onNext);
                }
                return onNext(true).then(function () {
                    neededChapters.list = Reference.normalize(Reference.split(Object.keys(books).reduce(function (r,b) {
                        Object.keys(books[b]).forEach(function (c){
                            r.push(b + c);
                        });
                        return r;
                    }, []).join(',')).map(function (d) {
                        d.version='ALL';
                        d.text='T';
                        d.verse=1;
                        return d;
                    })).map(function (d) {
                        return d.reference.split('').slice(0,-2).join('');
                    });
                    return neededChapters.list;
                });
            });
        }
        return neededChapters.list;
    });

    context.move = {};

    context.move.__defineGetter__('in', function () {
        var targetParent, targetParentPos = spurgeon.position.slice(-1)[0] - 1;
        if (targetParentPos < 0) {
            console.log('Before first element. Cannot move in.');
            return;
        }
        targetParent = spurgeon.currentList[targetParentPos];
        if (!targetParent.body) {
            console.log('Element of type [ x ] does not support children. Cannot move in.');
            return;
        }
        spurgeon.currentList = targetParent.body;
        spurgeon.position.push(spurgeon.currentList.length);
    });

    context.move.__defineGetter__('out', function () {
        if (spurgeon.position.length < 2) {
            console.log('Already all the way out.');
            return;
        }
        spurgeon.position.pop();
        spurgeon.currentList = spurgeon.root;
        spurgeon.position.slice(0, -1).forEach(function (insertPos) {
            spurgeon.currentList = spurgeon.currentList[insertPos - 1].body;
        });
    });

    context.add = {};

    pointRequest = new MultiPrompt()
    .setup(function () {
        this.point = {type:'point'};
    })
    .step('label', function (label) {
        if (label) {
            if (label === '-') {
                this.point.label = true;
            } else {
                this.point.label = label;
            }
        }
    })
    .step('text', function (text) {
        this.point.text = text;
    })
    .whenFinished(function () {
        this.point.body = [];
        var insertPos = spurgeon.position.pop();
        spurgeon.currentList.splice(insertPos, 0, this.point);
        spurgeon.position.push(insertPos + 1);
    });

    context.add.__defineGetter__('point', function () {
        return pointRequest;
    });

    passageRequest = new MultiPrompt()
    .step('reference', function (reference) {
        this.query = Reference.split(reference);
    })
    .whenFinished(function () {
        var self = this, insertPos = spurgeon.position.slice(-1)[0], parent = spurgeon.currentList;
        return Q.ninvoke(db.collection('verses'), 'find', {$or : self.query})
        .then(function (cursor) {
            return Q.ninvoke(cursor, 'toArray');
        })
        .then(function (verses) {
            var passages = Reference.normalize(verses);
            passages.forEach(function (passage) {
                passage.type = 'passage';
            });
            passages.unshift(insertPos, 0);
            Array.prototype.splice.apply(parent, passages);
            if (spurgeon.currentList === parent) {
                spurgeon.position.push(spurgeon.position.pop() + passages.length - 2);
            }
            console.log('Total verses added:', verses.length);
        });
    });

    context.input = {};

    inputChapterRequest = new MultiPrompt()
    .setup(function () {
        this.verses = [];
    })
    .step('version', function (version) {
        this.version = version;
    })
    .step('book', function (book) {
        this.book = book;
    })
    .step({
        prompt : 'chapter',
        convert : function (input) {
            return parseInt(input);
        },
        process : function (chapter) {
            this.chapter = chapter;
        }
    })
    .step({
        prompt : 'verse text',
        process : function (verseText) {
            if (verseText && verseText !== endTag) {
                this.verses.push(verseText);
            }
        },
        repeat : function (input) {
            return !!input.length && input !== endTag;
        }
    })
    .whenFinished(function () {
        var self = this;
        if (!context.inputVerses) {
            context.inputVerses = [];
        }
        Array.prototype.push.apply(context.inputVerses, self.verses.map(function (verseText, index) {
            return {
                version : self.version,
                book : self.book,
                chapter : self.chapter,
                verse : index + 1,
                text : verseText
            };
        }));
    });

    context.input.__defineGetter__('chapter', function () {
        return inputChapterRequest;
    });

    context.add.__defineGetter__('passage', function () {
        return passageRequest;
    });
}

console.log('Attempting to log on to the db. Please wait...');
Q.nfcall(MongoClient.connect, config.mongo.connection)
.then(function (connectedDb) {
    var session = new REPL({ignoreUndefined : true}).start();
    customExit(session, connectedDb);
    buildOperations(session.context, connectedDb);
}).done();

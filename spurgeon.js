'use strict';

var config = require('./spurgeon.json'),
cp = require('child_process'),
fs = require('fs'),
Q = require('q'),
deepcopy = require('deepcopy'),
MongoClient = require('mongodb').MongoClient,
REPL = require('./lib/repl'),
MultiPrompt = require('./lib/multi-prompt'),
Reference = require('./lib/reference');

function Spurgeon () {
    this.reset();
}

Spurgeon.prototype.setCurrentList = function (a) {
    var self = this;
    a.__defineGetter__('i', function () {
        return a[self.position.slice(-1)[0]];
    });
    a.__defineSetter__('i', function (v) {
        self.position[self.position.length - 1] = v < 0
        ? a.length + v + 1
        : v;
    });
    this.currentList = a;
};

Spurgeon.prototype.reset = function () {
    this.root = [];
    this.setCurrentList(this.root);
    this.position = [0];
    this.verseList = {};

    var vl = this.verseList;

    this.verseList.load = function(jsonFile) {
        vl.create(JSON.parse(fs.readFileSync(jsonFile)));
    }

    this.verseList.create = function(verseArray) {
        verseArray.forEach(function(d) {
            if (d.type !== 'passage') return;
            if(!vl[d.reference]) vl[d.reference] = {};
            if(vl[d.reference][d.version]){
                console.log(d.reference + '(' + d.version + ') was already loaded. Skipping...');
            } else {
                Object.defineProperty(vl[d.reference], d.version, {
                    configurable: false,
                    enumerable: true,
                    get: function() {
                        return deepcopy(d);
                    }
                })
            }
        });
    };

    var versesOut = function (ctx, vs) {
        var lastOut = Object.keys(vs)
           .map(function(t){return vs[t]})
           .map(function(tv, idx){return "v['" + tv.reference + "']." + tv.version})

        Object.keys(vs)
        .map(function(t){return vs[t]})
        .map(function(tv, idx){
            var l = tv.verses.map(function(d){return d.verse + '. ' + d.text});
            l.unshift((idx + ctx.idx) + ': ' + lastOut[idx]);
            return l})
        .reduce(function(r,d){r.push('');r.push.apply(r,d);return r},[])
        .forEach(function(d){console.log(d)});
        Array.prototype.push.apply(ctx.lastOut, lastOut)
        ctx.idx = ctx.idx + lastOut.length;
        return ctx;
    };

    this.verseList.find = function (regex) {
        this.lastOut = Object.keys(vl)
        .filter(function(d){return d.search(regex) !== -1 || d.indexOf(regex) !== -1})
        .sort()
        .map(function(d){return vl[d]})
        .reduce(versesOut, {lastOut:[], idx:0}).lastOut;
    };

    this.verseList.clip = function (idx) {
        var cmd = "echo -n " + JSON.stringify(this.lastOut[idx]) + " | xclip -i -selection c";
        cp.exec(cmd);
    };
};

function customExit (session) {
    session.commands['.exit'].action = function () {
        console.log('Attempting to log off of the db. Please wait...');
        Q.ninvoke(session.context.db,'close')
        .delay(2000).then(function () {
            delete session.context.db;
            process.exit();
        });
    }
}

function buildOperations (repl, context, db) {
    var spurgeon = new Spurgeon(),
    setFileRequest,  titleRequest, textRequest, pointRequest, passageRequest, hymnRequest, inputChapterRequest,
    endTag = '@@END@@';

    context.__defineGetter__('Q', function () {
        return Q;
    });

    context.__defineGetter__('db', function () {
        return db;
    });

    context.__defineGetter__('pos', function () {
        return spurgeon.position;
    });

    context.__defineGetter__('root', function () {
        return spurgeon.root;
    });

    context.__defineGetter__('current', function () {
        return spurgeon.currentList;
    });

    context.__defineGetter__('cur', function () {
        return spurgeon.currentList;
    });

    context.__defineGetter__('dump', function () {
        console.log(JSON.stringify(spurgeon.root, null, 2));
    });

    context.__defineGetter__('v', function() {
        return spurgeon.verseList;
    });

    context.set = {};

    setFileRequest = new MultiPrompt()
    .step('file name', function (fileName) {
        if (fileName) {
            spurgeon.targetFile = fileName;
        } else {
            delete spurgeon.targetFile;
        }
    });

    context.set.__defineGetter__('file', function () {
        return setFileRequest;
    });

    context.set.__defineGetter__('xclip', function () {
        repl.xclip(true);
    });

    context.set.__defineGetter__('noxclip', function () {
        repl.xclip(false);
    });

    context.__defineGetter__('write', function () {
        if (!spurgeon.targetFile) {
            throw new Error('No file set');
        }
        fs.writeFile(spurgeon.targetFile, JSON.stringify(spurgeon.root, null, 1), function () {});
    });

    context.__defineGetter__('read', function () {

        if (!spurgeon.targetFile) {
            throw new Error('No file set');
        }
        return Q.ninvoke(fs, 'readFile', spurgeon.targetFile)
        .then(function (text) {
            spurgeon.reset();
            spurgeon.root.push.apply(spurgeon.root, JSON.parse(text));
            spurgeon.position[0] = spurgeon.root.length;
        });
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

    function showWhere() {
        var targetPos = spurgeon.position.slice(-1)[0];
        if (targetPos < 0) {
            targetPos = 0;
        }
        var toShow = [];
        toShow.push.apply(toShow, spurgeon.currentList);
        toShow.splice(targetPos, 0, '{{ Insertion Point ' + JSON.stringify(spurgeon.position) + ' }}');
        return toShow;
    }

    context.__defineGetter__('where', showWhere);

    var move = {};

    context.move = move;

    function moveIn () {
        var targetParent, targetParentPos = spurgeon.position.slice(-1)[0] - 1;
        if (targetParentPos < 0) {
            console.log('Before first element. Cannot move in.');
            return;
        }
        targetParent = spurgeon.currentList[targetParentPos];
        if (!targetParent.body) {
            console.log('Element of type [ ' + targetParent.type + ' ] does not support children. Cannot move in.');
            return;
        }
        spurgeon.setCurrentList(targetParent.body);
        spurgeon.position.push(spurgeon.currentList.length);
        return move;
    }

    move.__defineGetter__('in', moveIn);
    move.__defineGetter__('i', moveIn);

    function moveOut () {
        if (spurgeon.position.length < 2) {
            console.log('Already all the way out.');
            return;
        }
        spurgeon.position.pop();
        spurgeon.setCurrentList(spurgeon.root);
        spurgeon.position.slice(0, -1).forEach(function (insertPos) {
            spurgeon.setCurrentList(spurgeon.currentList[insertPos - 1].body);
        });
        return context.move;
    }

    move.__defineGetter__('out', moveOut);
    move.__defineGetter__('o', moveOut);

    function moveUp () {
        var pos = spurgeon.position.pop();
        if (pos < 1) {
            console.log('Already at the top of the point.');
            spurgeon.position.push(0);
            return;
        }
        spurgeon.position.push(pos - 1);
        return context.move;
    }

    move.__defineGetter__('up', moveUp);
    move.__defineGetter__('u', moveUp);

    function moveDown () {
        var pos = spurgeon.position.pop();
        if (pos >= spurgeon.currentList.length) {
            console.log('Already at the bottom of the point.');
            spurgeon.position.push(spurgeon.currentList.length);
            return;
        }
        spurgeon.position.push(pos + 1);
        return context.move;
    }

    move.__defineGetter__('down', moveDown);
    move.__defineGetter__('d', moveDown);

    move.__defineGetter__('where', showWhere);
    move.__defineGetter__('w', showWhere);

    context.add = {};

    titleRequest = new MultiPrompt()
    .setup(function () {
        this.data = {
            type : 'title',
            lines : []
        };
    })
    .step({
        prompt : 'line',
        process : function (line) {
            if (!!line.length) {
                this.data.lines.push(line);
            }
        },
        repeat : function (line) {
            return !!line.length
        }
    })
    .step({
        prompt : 'duration',
        convert : function (input) {
            return parseInt(input);
        },
        process : function (duration) {
            if (duration) {
                this.data.duration = duration;
            }
        }
    })
    .whenFinished(function () {
        var insertPos = spurgeon.position.pop();
        spurgeon.currentList.splice(insertPos, 0, this.data);
        spurgeon.position.push(insertPos + 1);
    });

    context.add.__defineGetter__('title', function () {
        return titleRequest;
    });

    textRequest = new MultiPrompt()
    .setup(function () {
        this.data = {
            type : 'text',
            lines : []
        };
    })
    .step({
        prompt : 'line',
        process : function (line) {
            if (!!line.length) {
                this.data.lines.push(line);
            }
        },
        repeat : function (line) {
            return !!line.length
        }
    })
    .whenFinished(function () {
        var insertPos = spurgeon.position.pop();
        spurgeon.currentList.splice(insertPos, 0, this.data);
        spurgeon.position.push(insertPos + 1);
    });

    context.add.__defineGetter__('text', function () {
        return textRequest;
    });

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
            var passages = Reference.normalize(verses).map(function (passage) {
                return Object.keys(passage).reduce(function (obj, key) {
                    obj[key] = passage[key];
                    return obj;
                },{type : 'passage'});
            });
            spurgeon.verseList.create(passages);
            passages.unshift(insertPos, 0);
            Array.prototype.splice.apply(parent, passages);
            if (spurgeon.currentList === parent) {
                spurgeon.position.push(spurgeon.position.pop() + passages.length - 2);
            }
            console.log('Total verses added:', verses.length);
        });
    });

    context.add.__defineGetter__('passage', function () {
        return passageRequest;
    });

    hymnRequest = new MultiPrompt()
    .setup(function () {
        this.data = {
            type : 'hymn',
        };
    })
    .step('opening/closing (o/c/null)', function (oOrC) {
        if (oOrC.toLowerCase() === 'o') {
            this.data.opening = true;
        } else if (oOrC.toLowerCase() === 'c') {
            this.data.closing = true;
        }
    })
    .step('name', function (name) {
        this.data.name = name;
    })
    .step({
        prompt : 'number',
        convert : function (input) {
            return parseInt(input);
        },
        process : function (number) {
            this.data.number = number;
        }
    })
    .step('key', function (key) {
        this.data.key = key;
    })
    .step('start', function (start) {
        this.data.start = start;
    })
    .whenFinished(function () {
        this.data.duration = 5;
        var insertPos = spurgeon.position.pop();
        spurgeon.currentList.splice(insertPos, 0, this.data);
        spurgeon.position.push(insertPos + 1);
    });

    context.add.__defineGetter__('hymn', function () {
        return hymnRequest;
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

    context.__defineGetter__('refs', function () {
        return function (n) {
            if (n === undefined) n = 1;
            spurgeon.currentList.slice(-(n*2)).filter(function(v) {
                return v.version === 'KJV';
            }).map(function (v) {
                return v.reference;
            }).forEach(function(r) {
                console.log(r);
            })
        };
    });

    context.__defineGetter__('clipRef', function () {
        return function () {
            spurgeon.currentList.slice(-1).map(function (v) {
                return v.reference;
            }).forEach(function (r) {
                var cmd = "echo -n " + JSON.stringify(r) + " | xclip -i -selection c";
                cp.exec(cmd);
            })
        };
    });
}

console.log('Attempting to log on to the db. Please wait...');
Q.nfcall(MongoClient.connect, config.mongo.connection, config.mongo.options || {})
.then(function (connectedDb) {
    var repl = new REPL({ignoreUndefined : true});
    var session = repl.start();
    customExit(session, connectedDb);
    session.context.console.hist = function() {
        for (var c = 0, l = arguments.length; c < l; c++) {
            if (!!arguments[c]) {
                var val = JSON.stringify(arguments[c]);
                session.rli.history.unshift(val);
                console.log(val);
            }
        }
    };
    buildOperations(repl, session.context, connectedDb);
}).done();

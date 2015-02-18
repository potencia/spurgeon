'use strict';

var Q = require('q');

function SpurgeonRequest () {
    this.steps = [];
    this.complete = Q.defer();
}

function passThrough (val) { return val; }

SpurgeonRequest.prototype.step = function (message, convert) {
    var deferredStep = Q.defer();
    this.steps.push({
        message : message,
        convert : convert || passThrough,
        deferred : deferredStep
    });
    return deferredStep.promise;
};

Object.defineProperty(SpurgeonRequest.prototype, 'whenComplete', {
    get : function () {
        return this.complete.promise;
    }
});

function Spurgeon () {
    this.root = [];
    this.currentList = this.root;
    this.position = [0];
}

var spurgeonRepl = {
    repl : require('repl'),
    vm : require('vm'),
    createEval : function (options) {
        return function (code, context, file, callback) {
            var err, result = undefined;
            if (spurgeonRepl.currentRequest) {
                var data = code.split('');
                data.splice(0, 1);
                data.splice(-2, 2);
                try {
                    data = spurgeonRepl.currentRequest.steps[0].convert(data.join(''));
                } catch (e) {
                    err = e;
                }
                if (!err) {
                    spurgeonRepl.currentRequest.steps[0].deferred.resolve(data);
                    spurgeonRepl.currentRequest.steps.shift();
                    if (spurgeonRepl.currentRequest.steps.length > 0) {
                        spurgeonRepl.session.prompt = spurgeonRepl.currentRequest.steps[0].message + '> ';
                    } else {
                        spurgeonRepl.session.prompt = '> ';
                        spurgeonRepl.currentRequest.complete.resolve();
                        spurgeonRepl.currentRequest = undefined;
                    }
                }
            } else {
                try {
                    if (options.useGlobal) {
                        result = spurgeonRepl.vm.runInThisContext(code, file);
                    } else {
                        result = spurgeonRepl.vm.runInContext(code, context, file);
                    }
                    if (result instanceof SpurgeonRequest) {
                        if (result.steps.length > 0) {
                            spurgeonRepl.currentRequest = result;
                            spurgeonRepl.session.prompt = spurgeonRepl.currentRequest.steps[0].message + '> ';
                        }
                        result = undefined;
                    } else {
                        spurgeonRepl.session.prompt = '> ';
                    }
                } catch (e) {
                    result = undefined;
                    err = e;
                }
            }
            callback(err, result);
        };
    }
};

function buildOperations (context) {
    var spurgeon = new Spurgeon();

    context.__defineGetter__('root', function () {
        return spurgeon.root;
    });

    context.__defineGetter__('dump', function () {
        console.log(JSON.stringify(spurgeon.root, null, 2));
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

    context.add.__defineGetter__('point', function () {
        var request = new SpurgeonRequest(), point = {
            type : 'point'
        };

        request.step('label')
        .then(function (label) {
            if (label) {
                if (label === '-') {
                    point.label = true;
                } else {
                    point.label = label;
                }
            }
        });

        request.step('text')
        .then(function (text) {
            point.text = text;
        });

        request.whenComplete
        .then(function () {
            point.body = [];
            var insertPos = spurgeon.position.pop();
            spurgeon.currentList.splice(insertPos, 0, point);
            spurgeon.position.push(insertPos + 1);
        });

        return request;
    });
}

spurgeonRepl.start = function (options) {
    var o = {};
    Object.keys(options || {}).filter(function (key) {
        return key !== 'eval';
    }).forEach(function (key) {
        o[key] = options[key];
    });
    o['eval'] = spurgeonRepl.createEval(o);
    spurgeonRepl.session = spurgeonRepl.repl.start(o);
    buildOperations(spurgeonRepl.session.context);
    return spurgeonRepl.session;
};

spurgeonRepl.start({ignoreUndefined : true});

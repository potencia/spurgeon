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
    this.position = [0];
}

Object.defineProperty(Spurgeon.prototype, 'addPoint', {
    get : function () {
        var self = this, request = new SpurgeonRequest(), point = {
            type : 'point',
            body : []
        };

        request.step('label')
        .then(function (label) {
            if (label) {
                if (label === 'bull') {
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
            var insertPos = self.position.pop();
            self.root.splice(insertPos, 0, point);
            self.position.push(insertPos + 1);
        });

        return request;
    }
});

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

spurgeonRepl.start = function (options) {
    var o = {}, spurgeon = new Spurgeon();
    Object.keys(options || {}).filter(function (key) {
        return key !== 'eval';
    }).forEach(function (key) {
        o[key] = options[key];
    });
    o['eval'] = spurgeonRepl.createEval(o);
    spurgeonRepl.session = spurgeonRepl.repl.start(o);
    spurgeonRepl.session.context['sp'] = spurgeon;
    return spurgeonRepl.session;
};

spurgeonRepl.start({ignoreUndefined : true});

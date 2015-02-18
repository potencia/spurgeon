'use strict';

var Q = require('q');

function MultiPrompt () {
    this.steps = [];
    this.fn = {};
}

function isString (value) {
    return Object.prototype.toString.call(value) === '[object String]';
}

function isObject (value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}

function isFunction (value) {
    return Object.prototype.toString.call(value) === '[object Function]';
}

MultiPrompt.prototype.setup = function (setup) {
    if (!isFunction(setup)) {
        throw new Error('MultiPrompt.setup(): The argument must be a function.');
    }
    this.fn.setup = setup;
    return this;
};

MultiPrompt.prototype.whenFinished = function (finished) {
    if (!isFunction(finished)) {
        throw new Error('MultiPrompt.whenFinished(): The argument must be a function.');
    }
    this.fn.finished = finished;
    return this;
};

function noRepeat () { return false; }

MultiPrompt.prototype.step = function (prompt, process) {
    var step;
    if (isObject(prompt)) {
        step = prompt;
    } else {
        step = {
            prompt : prompt,
            process : process
        };
    }

    if (!isString(step.prompt)) {
        throw new Error('MultiPrompt.step(): The first argument, prompt, must be a string.');
    }
    if (!isFunction(step.process)) {
        throw new Error('MultiPrompt.step(): The second argument, process, must be a function.');
    }
    if (step.validate && !isFunction(step.validate)) {
        throw new Error('MultiPrompt.step(): If validate is provided it must be a function.');
    }
    if (step.convert && !isFunction(step.convert)) {
        throw new Error('MultiPrompt.step(): If convert is provided it must be a function.');
    }
    if (step.repeat) {
        if (!isFunction(step.repeat)) {
            throw new Error('MultiPrompt.step(): If repeat is provided it must be a function.');
        }
    } else {
        step.repeat = noRepeat;
    }

    this.steps.push(step);
    return this;
};

MultiPrompt.prototype.__defineGetter__('hasNext', function () {
    return !!this.togo.length;
});

MultiPrompt.prototype.__defineGetter__('nextPrompt', function () {
    if (this.hasNext) {
        return this.togo[0].prompt;
    }
    return undefined;
});

MultiPrompt.prototype.command = function (value) {
    if (this.hasNext) {
        return this.togo[0].pipeline.reduce(Q.when, Q(value));
    }
    return Q();
};

function validationCheck (prompt, validate, value) {
    return validate(value).then(function (isValid) {
        if (isValid) {
            return value;
        }
        throw new Error('Value [ ' + value + ' ] is invalid for step [ ' + prompt + ' ].');
    });
}

function processValue (process, value) {
    return process(value).thenResolve(value);
}

function repeatCheck (multiPrompt, repeat, value) {
    return repeat(value).then(function (shouldRepeat) {
        if (!shouldRepeat) {
            multiPrompt.togo.shift();
        }
    });
}

function prepareStep (step) {
    var togo = {
        prompt : step.prompt,
        pipeline : []
    };

    if (step.convert) {
        togo.pipeline.push(Q.fbind(step.convert.bind(this.context)));
    }
    if (step.validate) {
        togo.pipeline.push(validationCheck.bind(null, step.prompt, Q.fbind(step.validate.bind(this.context))));
    }
    togo.pipeline.push(processValue.bind(null, Q.fbind(step.process.bind(this.context))));
    togo.pipeline.push(repeatCheck.bind(null, this, Q.fbind(step.repeat.bind(this.context))));
    return togo;
}

MultiPrompt.prototype.initialize = function () {
    this.context = {};
    this.togo = this.steps.map(prepareStep, this);
    if (this.fn.setup) {
        return Q.fcall(this.fn.setup.bind(this.context));
    }
    return Q();
};

MultiPrompt.prototype.finalize = function () {
    if (this.fn.finished) {
        return Q.fcall(this.fn.finished.bind(this.context));
    }
    return Q();
};

module.exports = MultiPrompt;

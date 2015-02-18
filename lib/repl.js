'use strict';

var Q = require('q'),
repl = require('repl'),
vm = require('vm'),
MultiPrompt = require('./multi-prompt');

function REPL (options) {
    var repl = this, commands = [], fireNext = true;
    repl.options = options || {};
    repl.options.prompt = repl.options.prompt || '> ';

    function next () {
        var toProcess = commands.shift(), promise;
        if (toProcess) {
            fireNext = false;
            if (repl.multiPrompt) {
                promise = Q.try(repl.multiPrompt.command.bind(repl.multiPrompt), toProcess.command.split('').slice(1, -2).join(''));
            } else {
                if (repl.options.useGlobal) {
                    promise = Q.try(vm.runInThisContext, toProcess.command, toProcess.file);
                } else {
                    promise = Q.try(vm.runInContext, toProcess.command, toProcess.context, toProcess.file);
                }
            }
            promise.then(function (response) {
                if (response instanceof MultiPrompt) {
                    repl.multiPrompt = response;
                    return repl.multiPrompt.initialize();
                }
                return response;
            }).then(function (response) {
                if (repl.multiPrompt) {
                    if (repl.multiPrompt.hasNext) {
                        repl.setPromptText(repl.multiPrompt.nextPrompt);
                        return undefined;
                    } else {
                        repl.setPromptText();
                        response = repl.multiPrompt.finalize();
                        delete repl.multiPrompt;
                    }
                }
                return response;
            }).then(function (response) {
                toProcess.callback(undefined, response);
            }, function (reason) {
                if (process.domain) {
                    process.domain.emit('error', reason);
                    process.domain.exit();
                } else {
                    toProcess.callback(reason);
                }
            }).done(next);
        } else {
            fireNext = true;
        }
    }

    repl.options['eval'] = function (command, context, file, callback) {
        commands.push({
            command : command,
            context : context,
            file : file,
            callback : callback
        });
        if (fireNext) {
            next();
        }
    };
}

REPL.prototype.start = function () {
    this.session = repl.start(this.options);
    return this.session;
};

REPL.prototype.setPromptText = function (text) {
    if (text) {
        this.session.prompt = text + this.options.prompt;
    } else {
        this.session.prompt = this.options.prompt;
    }
};

module.exports = REPL;

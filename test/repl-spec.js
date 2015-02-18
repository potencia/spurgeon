'use strict';

var expect = require('chai').expect,
sinon = require('sinon'),
vm = require('vm'),
Q = require('q'),
REPL = require('../lib/repl'),
MultiPrompt = require('../lib/multi-prompt');

describe('REPL', function () {
    var repl, context;
    beforeEach(function () {
        Q.longStackSupport = true;
        repl = new REPL();
        repl.session = {};
        context = vm.createContext();
    });

    afterEach(function () {
        Q.longStackSupport = false;
    });

    describe('.options.eval()', function () {
        it('should call the callback with the results of the command', function (done) {
            context.x = 5;
            repl.options.eval('x + 1', context, 'repl', function (err, result) {
                expect(err).to.be.undefined;
                expect(result).to.equal(6);
                done();
            });
        });

        it('should use the global context when the options.useGlobal is true', function (done) {
            global.x = 15;
            context.x = 20;
            repl = new REPL({useGlobal : true});
            repl.options.eval('x + 1', context, 'repl', function (err, result) {
                delete global.x;
                expect(err).to.be.undefined;
                expect(result).to.equal(16);
                done();
            });
        });

        it('should report errors that occur during execution', function (done) {
            var oldDomain = process.domain;
            delete process.domain;
            repl.options.eval('notThere()', context, 'repl', function (err, result) {
                if (oldDomain) {
                    process.domain = oldDomain;
                }
                expect(err.constructor.name).to.equal('ReferenceError');
                expect(err.message).to.equal('notThere is not defined');
                expect(result).to.be.undefined;
                done();
            });
        });

        it('should call process.domain.exit() when appropriate', function (done) {
            var restoreDomain = false, realExit;
            if (process.domain) {
                restoreDomain = true;
                realExit = process.domain.exit;
            } else {
                process.domain = {
                    enter : sinon.stub(),
                    emit : sinon.stub()
                };
            }

            process.domain.exit = function () {
                if (restoreDomain) {
                    process.domain.exit = realExit;
                } else {
                    delete process.domain;
                }
                expect(arguments).to.have.length(0);
                done();
            };

            repl.options.eval('shouldNotBeDefined()', context, 'repl', function () {});
        });

        it('should call the callback with deferred results if the command returns a Q promise', function (done) {
            context.Q = Q;
            var started = Date.now();
            repl.options.eval('Q(\'These are the results.\').delay(500)', context, 'repl', function (err, result) {
                expect(err).to.be.undefined;
                expect(result).to.equal('These are the results.');
                expect(Date.now() - started).to.be.greaterThan(400);
                done();
            });
        });

        it('should process all commands in the order they were received', function (done) {
            var d, c, l = 5, commands = [], deferred = [], results = [];
            context.promises = [];
            for (c = 0; c < l; c++) {
                d = Q.defer();
                deferred.push(d);
                context.promises.push(d.promise);
                commands.push('promises[' + c + '].then(function () { return ' + (c + 1) + ' * ' + (c + 1) + '; })');
            }
            function callback (err, result) {
                expect(!!err).to.be.false;
                results.push(result);
                if (results.length === l) {
                    for(c = 0; c < l; c++) {
                        expect(results[c], commands[c]).to.equal((c + 1) * (c + 1));
                    }
                    done();
                }
            }

            Q()
            .then(function () { repl.options.eval(commands[0], context, 'repl', callback); })
            .then(function () { repl.options.eval(commands[1], context, 'repl', callback); })
            .then(function () { repl.options.eval(commands[2], context, 'repl', callback); })
            .then(function () { deferred[2].resolve(); })
            .then(function () { deferred[0].resolve(); })
            .then(function () { deferred[1].resolve(); })
            .then(function () { repl.options.eval(commands[3], context, 'repl', callback); })
            .then(function () { repl.options.eval(commands[4], context, 'repl', callback); })
            .then(function () { deferred[4].resolve(); })
            .then(function () { deferred[3].resolve(); });
        });

        describe('when the resulting object is a MultiPrompt object', function () {
            beforeEach(function () {
                context.mp = new MultiPrompt();
                context.mp.togo = [{
                    prompt : 'foo!',
                    pipeline : [function () {}]
                }];
                sinon.stub(context.mp, 'initialize');
            });

            it('should result in undefined', function (done) {
                repl.options.eval('mp', context, 'repl', function (err, result) {
                    expect(err).to.be.undefined;
                    expect(result).to.be.undefined;
                    done();
                });
            });

            it('should call .initialize()', function (done) {
                repl.options.eval('mp', context, 'repl', function () {
                    expect(context.mp.initialize.callCount).to.equal(1);
                    expect(context.mp.initialize.firstCall.args).to.have.length(0);
                    done();
                });
            });

            it('should call .setPromptText() with the value of MultiPrompt.nextPrompt', function (done) {
                sinon.stub(repl, 'setPromptText');
                repl.options.eval('mp', context, 'repl', function () {
                    expect(repl.setPromptText.callCount).to.equal(1);
                    expect(repl.setPromptText.firstCall.args).to.deep.equal(['foo!']);
                    done();
                });
            });

            it('should store the MultiPrompt object in the [ multiPrompt ] property', function (done) {
                repl.options.eval('mp', context, 'repl', function () {
                    expect(repl.multiPrompt).to.equal(context.mp);
                    done();
                });
            });
        });

        describe('when the [ multiPrompt ] property is set', function () {
            beforeEach(function () {
                repl.multiPrompt = new MultiPrompt();
                sinon.stub(repl.multiPrompt, 'command');
            });

            describe('and multiPrompt.hasNext is true', function () {
                beforeEach(function (done) {
                    repl.multiPrompt.step('baz', function () {});
                    repl.multiPrompt.initialize().done(done);
                });

                it('should send the command to multiPrompt.command()', function (done) {
                    repl.options.eval('(Some Text\n)', context, 'repl', function () {
                        expect(repl.multiPrompt.command.callCount).to.equal(1);
                        expect(repl.multiPrompt.command.firstCall.args).to.deep.equal(['Some Text']);
                        expect(repl.multiPrompt.command.firstCall.calledOn(repl.multiPrompt)).to.be.true;
                        done();
                    });
                });

                describe('when command returns a promise', function () {
                    it('should result in undefined', function (done) {
                        repl.multiPrompt.command.returns(Q('The Answer').delay(10));
                        repl.options.eval('Some Text', context, 'repl', function (err, result) {
                            expect(err).to.be.undefined;
                            expect(result).to.be.undefined;
                            done();
                        });
                    });
                });

                describe('when command returns a non-promise', function () {
                    it('should result in undefined', function (done) {
                        repl.multiPrompt.command.returns(42);
                        repl.options.eval('Some Text', context, 'repl', function (err, result) {
                            expect(err).to.be.undefined;
                            expect(result).to.be.undefined;
                            done();
                        });
                    });
                });

                it('should call .setPromptText() with the value of MultiPrompt.nextPrompt', function (done) {
                    sinon.stub(repl, 'setPromptText');
                    repl.options.eval('Some Text', context, 'repl', function () {
                        expect(repl.setPromptText.callCount).to.equal(1);
                        expect(repl.setPromptText.firstCall.args).to.deep.equal(['baz']);
                        done();
                    });
                });

                it('should leave the MultiPrompt object in the [ multiPrompt ] property', function (done) {
                    var mp = repl.multiPrompt;
                    repl.options.eval('Some Text', context, 'repl', function () {
                        expect(repl.multiPrompt).to.equal(mp);
                        done();
                    });
                });
            });

            describe('and multiPrompt.hasNext is false', function () {
                var mp;
                beforeEach(function (done) {
                    mp = repl.multiPrompt;
                    mp.initialize().done(done);
                });

                it('should send the command to multiPrompt.command()', function (done) {
                    repl.options.eval('(Some Text\n)', context, 'repl', function () {
                        expect(mp.command.callCount).to.equal(1);
                        expect(mp.command.firstCall.args).to.deep.equal(['Some Text']);
                        done();
                    });
                });

                describe('when multiPrompt.finalize() returns a non-promise', function () {
                    it('should result in the return its result', function (done) {
                        sinon.stub(repl.multiPrompt, 'finalize').returns(42);
                        repl.options.eval('Some Text', context, 'repl', function (err, result) {
                            expect(mp.finalize.callCount).to.equal(1);
                            expect(mp.finalize.firstCall.args).to.have.length(0);
                            expect(err).to.be.undefined;
                            expect(result).to.equal(42);
                            done();
                        });
                    });
                });

                describe('when multiPrompt.finalize() returns a promise', function () {
                    it('should result in the return its result', function (done) {
                        sinon.stub(repl.multiPrompt, 'finalize').returns(Q('The Answer').delay(10));
                        repl.options.eval('Some Text', context, 'repl', function (err, result) {
                            expect(mp.finalize.callCount).to.equal(1);
                            expect(mp.finalize.firstCall.args).to.have.length(0);
                            expect(err).to.be.undefined;
                            expect(result).to.equal('The Answer');
                            done();
                        });
                    });
                });

                it('should call .setPromptText() with no argument', function (done) {
                    sinon.stub(repl, 'setPromptText');
                    repl.options.eval('Some Text', context, 'repl', function () {
                        expect(repl.setPromptText.callCount).to.equal(1);
                        expect(repl.setPromptText.firstCall.args).to.have.length(0);
                        done();
                    });
                });

                it('should delete the [ multiPrompt ] property', function (done) {
                    repl.options.eval('Some Text', context, 'repl', function () {
                        expect(repl.hasOwnProperty('multiPrompt')).to.be.false;
                        done();
                    });
                });
            });
        });
    });

    describe('.setPromptText()', function () {
        it('should set session.prompt to options.prompt when called with no arguments', function () {
            repl.options.prompt = 'bar';
            repl.session.prompt = 'foo';
            repl.setPromptText();
            expect(repl.session.prompt).to.equal('bar');
        });

        it('should set session.prompt to the value prepended to options.prompt when called with a value', function () {
            repl.options.prompt = '$ ';
            repl.session.prompt = 'foo';
            repl.setPromptText('baz');
            expect(repl.session.prompt).to.equal('baz$ ');
        });
    });
});

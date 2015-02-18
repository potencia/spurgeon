'use strict';

var expect = require('chai').expect,
sinon = require('sinon'),
MultiPrompt = require('../lib/multi-prompt');

describe('MultiPrompt', function () {
    var mp;

    beforeEach(function () {
        mp = new MultiPrompt()
    });

    describe('when no steps are defined', function () {
        beforeEach(function (done) {
            mp.initialize().done(done);
        });

        describe('.hasNext', function () {
            it('should be false', function () {
                expect(mp.hasNext).to.be.false;
            });
        });

        describe('.nextPrompt', function () {
            it('should be undefined', function () {
                expect(mp.nextPrompt).to.be.undefined;
            });
        });

        describe('.command()', function () {
            it('should resolve to undefined', function (done) {
                mp.command('text').then(function (result) {
                    expect(result).to.be.undefined;
                }).done(done);
            });
        });
    });

    describe('when a step has been defined', function () {
        beforeEach(function (done) {
            mp.step('data', function () {
                return 'The Answer!';
            });
            mp.initialize().done(done);
        });

        describe('.hasNext', function () {
            it('should be true', function () {
                expect(mp.hasNext).to.be.true;
            });
        });

        describe('.nextPrompt', function () {
            it('should be return the next step\'s prompt text', function () {
                expect(mp.nextPrompt).to.equal('data');
            });
        });

        describe('.command()', function () {
            it('should return undefined', function (done) {
                mp.command(42).then(function (result) {
                    expect(result).to.be.undefined;
                }).done(done);
            });

            it('should remove the step', function (done) {
                mp.command(42).then(function () {
                    expect(mp.hasNext).to.be.false;
                }).done(done);
            });
        });
    });

    describe('.setup()', function () {
        it('should return the MultiPrompt object for chaining', function () {
            expect(mp.setup(function () {})).to.equal(mp);
        });

        describe('when the first argument is not a function', function () {
            it('should throw an error', function () {
                try {
                    mp.setup('test');
                    expect(false, 'An error should have been thrown').to.be.true;
                } catch (err) {
                    expect(err.message).to.equal('MultiPrompt.setup(): The argument must be a function.');
                }
            });
        });

        describe('when the first argument is a function', function () {
            it('should set the [ fn.setup ] property', function () {
                function setup () {}
                mp.setup(setup);
                expect(mp.fn.setup).to.equal(setup);
            });
        });
    });

    describe('.step()', function () {
        it('should return the MultiPrompt object for chaining', function () {
            expect(mp.step('test', function () {})).to.equal(mp);
        });

        describe('when the first argument is not a string', function () {
            it('should throw an error', function () {
                try {
                    mp.step(5);
                    expect(false, 'An error should have been thrown').to.be.true;
                } catch (err) {
                    expect(err.message).to.equal('MultiPrompt.step(): The first argument, prompt, must be a string.');
                }
            });
        });

        describe('when the second argument is not a function', function () {
            it('should throw an error', function () {
                try {
                    mp.step('test', 'test');
                    expect(false, 'An error should have been thrown').to.be.true;
                } catch (err) {
                    expect(err.message).to.equal('MultiPrompt.step(): The second argument, process, must be a function.');
                }
            });
        });

        describe('when the prompt and process are provided correctly', function () {
            it('should add the step to the list', function () {
                function process () {}
                mp.step('test', process);
                expect(mp.steps[0].prompt).to.equal('test');
                expect(mp.steps[0].process).to.equal(process);
            });
        });

        describe('when a valid step object is provided', function () {
            it('should add the step to the list', function () {
                function process () {}
                mp.step({
                    prompt : 'test',
                    process : process
                });
                expect(mp.steps[0].prompt).to.equal('test');
                expect(mp.steps[0].process).to.equal(process);
            });
        });

        describe('when the property [ validate ] is provided in a step object but it is not a function', function () {
            it('should throw an error', function () {
                try {
                    mp.step({
                        prompt : 'test',
                        process : function () {},
                        validate : 'validate'
                    });
                    expect(false, 'An error should have been thrown').to.be.true;
                } catch (err) {
                    expect(err.message).to.equal('MultiPrompt.step(): If validate is provided it must be a function.');
                }
            });
        });

        describe('when the property [ convert ] is provided in a step object but it is not a function', function () {
            it('should throw an error', function () {
                try {
                    mp.step({
                        prompt : 'test',
                        process : function () {},
                        convert : 'convert'
                    });
                    expect(false, 'An error should have been thrown').to.be.true;
                } catch (err) {
                    expect(err.message).to.equal('MultiPrompt.step(): If convert is provided it must be a function.');
                }
            });
        });

        describe('when the property [ repeat ] is provided in a step object but it is not a function', function () {
            it('should throw an error', function () {
                try {
                    mp.step({
                        prompt : 'test',
                        process : function () {},
                        repeat : 'repeat'
                    });
                    expect(false, 'An error should have been thrown').to.be.true;
                } catch (err) {
                    expect(err.message).to.equal('MultiPrompt.step(): If repeat is provided it must be a function.');
                }
            });
        });
    });

    describe('.whenFinished()', function () {
        it('should return the MultiPrompt object for chaining', function () {
            expect(mp.whenFinished(function () {})).to.equal(mp);
        });

        describe('when the first argument is not a function', function () {
            it('should throw an error', function () {
                try {
                    mp.whenFinished('test');
                    expect(false, 'An error should have been thrown').to.be.true;
                } catch (err) {
                    expect(err.message).to.equal('MultiPrompt.whenFinished(): The argument must be a function.');
                }
            });
        });

        describe('when the first argument is a function', function () {
            it('should set the [ fn.finished ] property', function () {
                function finished () {}
                mp.whenFinished(finished);
                expect(mp.fn.finished).to.equal(finished);
            });
        });
    });

    describe('.initialize()', function () {
        it('should set the context property to a new object', function (done) {
            mp.initialize().then(function () {
                expect(mp.context).to.deep.equal({});
                mp.context = 'foo!';
                return mp.initialize();
            }).then(function () {
                expect(mp.context).to.deep.equal({});
            })
            .done(done);
        });

        describe('when fn.setup is defined', function () {
            var setupStub;
            beforeEach(function () {
                setupStub = sinon.stub();
                mp.setup(setupStub);
            });

            it('should call fn.setup()', function (done) {
                mp.initialize().then(function () {
                    expect(setupStub.callCount).to.equal(1);
                }).done(done);
            });

            it('should use [ context ] as [ this ]', function (done) {
                mp.initialize().then(function () {
                    expect(setupStub.firstCall.calledOn(mp.context)).to.be.true;
                }).done(done);
            });
        });
    });

    describe('.command()', function () {
        var called, convertSpy, validateSpy, processSpy, repeatSpy;

        function convert (str) {
            called.push('convert');
            return parseInt(str);
        }

        function validate () {
            called.push('validate');
            return true;
        }

        function process () {
            called.push('process');
        }

        function repeat () {
            called.push('repeat');
            return false;
        }

        beforeEach(function (done) {
            called = [];
            processSpy = sinon.spy(process);
            mp.step('something', processSpy);
            mp.initialize().done(done);
        });

        it('should call process()', function (done) {
            mp.command().then(function () {
                expect(processSpy.callCount).to.equal(1);
            }).done(done);
        });

        it('should use [ context ] as [ this ]', function (done) {
            mp.command().then(function () {
                expect(processSpy.firstCall.calledOn(mp.context)).to.be.true;
            }).done(done);
        });

        it('should pass its value to process()', function (done) {
            mp.command('42').then(function () {
                expect(processSpy.firstCall.args).to.deep.equal(['42']);
            }).done(done);
        });

        describe('when validate() is provided', function () {
            beforeEach(function (done) {
                validateSpy = sinon.spy(validate);
                mp.steps = [];
                mp.step({
                    prompt : 'something',
                    process : processSpy,
                    validate : validateSpy
                });
                mp.initialize().done(done);
            });

            it('should call validate() before process()', function (done) {
                mp.command().then(function () {
                    expect(called).to.deep.equal(['validate', 'process']);
                }).done(done);
            });

            it('should use [ context ] as [ this ]', function (done) {
                mp.command().then(function () {
                    expect(validateSpy.firstCall.calledOn(mp.context)).to.be.true;
                }).done(done);
            });

            it('should pass its value to validate()', function (done) {
                mp.command('The Answer').then(function () {
                    expect(validateSpy.firstCall.args).to.deep.equal(['The Answer']);
                }).done(done);
            });

            it('should reject if the validate() returns falsey', function (done) {
                mp.steps = [];
                mp.step({
                    prompt : 'something',
                    process : processSpy,
                    validate : function () {
                        return false;
                    }
                });
                mp.initialize().then(function () {
                    return mp.command('65');
                }).then(function () {
                    expect(false, 'An error should have been thrown').to.be.true;
                }, function (reason) {
                    expect(reason.message).to.equal('Value [ 65 ] is invalid for step [ something ].');
                }).done(done);
            });

            it('should send the value to process() if validate() returns truthy', function (done) {
                mp.command('65').then(function () {
                    expect(processSpy.firstCall.args).to.deep.equal(['65']);
                }).done(done);
            });

            describe('when convert() is provided', function () {
                beforeEach(function (done) {
                    convertSpy = sinon.spy(convert);
                    mp.steps = [];
                    mp.step({
                        prompt : 'something',
                        process : processSpy,
                        validate : validateSpy,
                        convert : convertSpy
                    });
                    mp.initialize().done(done);
                });

                it('should call convert() before validate() and process()', function (done) {
                    mp.command().then(function () {
                        expect(called).to.deep.equal(['convert', 'validate', 'process']);
                    }).done(done);
                });

                it('should use [ context ] as [ this ]', function (done) {
                    mp.command().then(function () {
                        expect(convertSpy.firstCall.calledOn(mp.context)).to.be.true;
                    }).done(done);
                });

                it('should pass its value to convert()', function (done) {
                    mp.command('15.7').then(function () {
                        expect(convertSpy.firstCall.args).to.deep.equal(['15.7']);
                    }).done(done);
                });

                it('should send the converted value to validate()', function (done) {
                    mp.command('15.7').then(function () {
                        expect(validateSpy.firstCall.args).to.deep.equal([15]);
                    }).done(done);
                });

                it('should send the converted value to process() if validate() returns truthy', function (done) {
                    mp.command('15.7').then(function () {
                        expect(processSpy.firstCall.args).to.deep.equal([15]);
                    }).done(done);
                });
            });
        });

        describe('when convert() is provided', function () {
            beforeEach(function (done) {
                convertSpy = sinon.spy(convert);
                mp.steps = [];
                mp.step({
                    prompt : 'something',
                    process : processSpy,
                    convert : convertSpy
                });
                mp.initialize().done(done);
            });

            it('should call convert() before process()', function (done) {
                mp.command().then(function () {
                    expect(called).to.deep.equal(['convert', 'process']);
                }).done(done);
            });

            it('should use [ context ] as [ this ]', function (done) {
                mp.command().then(function () {
                    expect(convertSpy.firstCall.calledOn(mp.context)).to.be.true;
                }).done(done);
            });

            it('should pass its value to convert()', function (done) {
                mp.command('15.7').then(function () {
                    expect(convertSpy.firstCall.args).to.deep.equal(['15.7']);
                }).done(done);
            });

            it('should send the converted value to process()', function (done) {
                mp.command('15.7').then(function () {
                    expect(processSpy.firstCall.args).to.deep.equal([15]);
                }).done(done);
            });
        });

        describe('when repeat() is provided', function () {
            beforeEach(function (done) {
                repeatSpy = sinon.spy(repeat);
                mp.steps = [];
                mp.step({
                    prompt : 'something',
                    process : processSpy,
                    repeat : repeatSpy
                });
                mp.initialize().done(done);
            });

            it('should call repeat() after process()', function (done) {
                mp.command().then(function () {
                    expect(called).to.deep.equal(['process', 'repeat']);
                }).done(done);
            });

            it('should use [ context ] as [ this ]', function (done) {
                mp.command().then(function () {
                    expect(repeatSpy.firstCall.calledOn(mp.context)).to.be.true;
                }).done(done);
            });

            it('should be passed the value passed to process', function (done) {
                mp.command('42').then(function () {
                    expect(repeatSpy.firstCall.args).to.deep.equal(['42']);
                }).done(done);
            });

            it('should remove the step when repeat() returns falsey', function (done) {
                mp.command().then(function () {
                    expect(mp.steps).to.length(1);
                    expect(mp.togo).to.length(0);
                    expect(mp.hasNext).to.be.false;
                }).done(done);
            });

            it('should NOT remove the step when repeat() returns truthy', function (done) {
                mp.steps = [];
                mp.step({
                    prompt : 'something',
                    process : processSpy,
                    repeat : function () { return true; }
                });
                mp.initialize().then(function () {
                    return mp.command();
                }).then(function () {
                    expect(mp.steps).to.length(1);
                    expect(mp.togo).to.length(1);
                    expect(mp.hasNext).to.be.true;
                    return mp.command();
                }).then(function () {
                    expect(mp.hasNext).to.be.true;
                }).done(done);
            });
        });
    });

    describe('.finalize()', function () {
        var afterStepsSpy;

        function afterSteps () {
            this.tested = true;
            return this;
        }

        beforeEach(function (done) {
            afterStepsSpy = sinon.spy(afterSteps);
            mp.whenFinished(afterStepsSpy);
            mp.initialize().done(done);
        });

        it('should call the function passed to whenFinished()', function (done) {
            mp.finalize().then(function () {
                expect(afterStepsSpy.callCount).to.equal(1);
            }).done(done);
        });

        it('should use [ context ] as [ this ]', function (done) {
            mp.finalize().then(function () {
                expect(afterStepsSpy.firstCall.calledOn(mp.context)).to.be.true;
            }).done(done);
        });

        it('should resolve with the return value of the whenFinished function', function (done) {
            mp.finalize().then(function (result) {
                expect(result).to.deep.equal({
                    tested : true
                });
            }).done(done);
        });
    });
});

'use strict';

var expect = require('chai').expect,
sinon = require('sinon'),
ConsoleLayout = require('../lib/console-layout');

describe('ConsoleLayout', function () {
    var cl, stdout, stdOutStub;
    beforeEach(function () {
        stdout = {
            isTTY : true,
            columns : 42,
            rows : 55,
            on : sinon.stub(),
            write : sinon.stub()
        };
        stdOutStub = sinon.stub(ConsoleLayout.create, 'getStdOut').returns(stdout);
        cl = ConsoleLayout.create();
    });

    afterEach(function () {
        stdOutStub.restore();
    });

    describe('static .create()', function () {
        describe('when isTTY is false', function () {
            beforeEach(function () {
                stdout.isTTY = false;
            });

            it('should return undefined', function () {
                expect(ConsoleLayout.create()).to.be.undefined;
            });
        });

        describe('when isTTY is true', function () {
            it('should return a ConsoleLayout object', function () {
                stdOutStub.restore();
                expect(cl).to.be.instanceOf(ConsoleLayout);
                stdOutStub = sinon.stub(ConsoleLayout.create, 'getStdOut').returns(stdout);
            });
        });
    });

    it('should know the width of the screen', function () {
        expect(cl.width).to.equal(42);
    });

    it('should know the height of the screen', function () {
        expect(cl.height).to.equal(55);
    });

    it('should register for the resize event', function () {
        expect(stdout.on.callCount).to.equal(1);
        expect(stdout.on.firstCall.args).to.have.length(2);
        expect(stdout.on.firstCall.args[0]).to.equal('resize');
        expect(stdout.on.firstCall.args[1]).to.be.a('function');
    });

    describe('when the stdout resize event fires', function () {
        beforeEach(function () {
            stdout.rows = 42;
            stdout.columns = 55;
            stdout.on.firstCall.args[1]();
        });

        it('should update the width', function () {
            expect(cl.width).to.equal(55);
        });

        it('should update the height', function () {
            expect(cl.height).to.equal(42);
        });
    });

    describe('.outputAll()', function () {
        it('should', function () {
            cl.outputAll([ { type : 'point',
                             label : 'I',
                             text : 'First Point',
                             body : [] } ]);
            expect(stdout.write.callCount).to.equal(1);
            expect(stdout.write.getCall(0).args[0]).to.equal('I. First Point\n');
        });
    });
});

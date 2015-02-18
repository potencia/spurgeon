'use strict';

var expect = require('chai').expect,
Layout = require('../lib/layout');

describe('Layout', function () {
    var layout, lines;
    beforeEach (function () {
        layout = new Layout();
        layout.columns = 70;
    });

    describe('on instantiation', function () {
        var processColumns;
        beforeEach (function () {
            processColumns = process.stdout.columns;
            layout = new Layout();
        });

        it('should understand the columns of the console', function () {
            expect(layout.indent).to.equal(4);
        });

        it('should default the indent', function () {
            expect(layout.columns).to.equal(processColumns);
        });
    });

    describe('.layoutPoint()', function () {
        describe('when label is falsey', function () {
            beforeEach(function () {
                lines = layout.layoutPoint({
                    "type" : "point",
                    "text": "Wants pawn term dare worsted ladle gull hoe hat search putty yowler coils debt pimple colder Guilty Looks. Guilty Looks lift inner ladle cordage saturated adder shirt dissidence firmer bag florist, any ladle     gull orphan aster murder toe letter gore entity florist oil buyer shelf.",
                    "body": []
                });
            });

            it('should return a list of lines', function () {
                expect(lines).to.be.an('array');
            });

            it('should split a long line into multiple lines', function () {
                expect(lines).to.have.length(5);
                expect(lines[0]).to.equal('Wants pawn term dare worsted ladle gull hoe hat search putty yowler');
                expect(lines[1]).to.equal('coils debt pimple colder Guilty Looks. Guilty Looks lift inner ladle');
                expect(lines[2]).to.equal('cordage saturated adder shirt dissidence firmer bag florist, any ladle');
                expect(lines[3]).to.equal('gull orphan aster murder toe letter gore entity florist oil buyer');
                expect(lines[4]).to.equal('shelf.');
            });

            it('should have all lines indented the same', function () {
                expect(lines[0].split('')[0]).to.not.equal(' ');
                expect(lines[1].split('')[0]).to.not.equal(' ');
                expect(lines[2].split('')[0]).to.not.equal(' ');
                expect(lines[3].split('')[0]).to.not.equal(' ');
                expect(lines[4].split('')[0]).to.not.equal(' ');
            });

            it('should split at space characters', function () {
                expect(lines[0].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[1].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[2].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[3].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[4].split('').slice(-1)[0]).to.not.equal(' ');
            });
        });

        describe('when label is true', function () {
            beforeEach(function () {
                lines = layout.layoutPoint({
                    "type" : "point",
                    "label" : true,
                    "text": "Wants pawn term dare worsted ladle gull hoe hat search putty yowler coils debt pimple colder Guilty Looks. Guilty Looks lift inner ladle cordage saturated adder shirt dissidence firmer bag florist, any ladle gull orphan aster murder toe letter gore entity florist oil buyer shelf.",
                    "body": []
                });
            });

            it('should return a list of lines', function () {
                expect(lines).to.be.an('array');
            });

            it('should split a long line into multiple lines', function () {
                expect(lines).to.have.length(5);
                expect(lines[0]).to.equal('-   Wants pawn term dare worsted ladle gull hoe hat search putty');
                expect(lines[1]).to.equal('    yowler coils debt pimple colder Guilty Looks. Guilty Looks lift');
                expect(lines[2]).to.equal('    inner ladle cordage saturated adder shirt dissidence firmer bag');
                expect(lines[3]).to.equal('    florist, any ladle gull orphan aster murder toe letter gore entity');
                expect(lines[4]).to.equal('    florist oil buyer shelf.');
            });

            it('should have have a hanging indent using a dash as the bullet', function () {
                expect(lines[0].split('').slice(0, 4).join('')).to.equal('-   ');
                expect(lines[1].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[2].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[3].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[4].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[0].split('')[5]).to.not.equal(' ');
                expect(lines[1].split('')[5]).to.not.equal(' ');
                expect(lines[2].split('')[5]).to.not.equal(' ');
                expect(lines[3].split('')[5]).to.not.equal(' ');
                expect(lines[4].split('')[5]).to.not.equal(' ');
            });

            it('should split at space characters', function () {
                expect(lines[0].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[1].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[2].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[3].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[4].split('').slice(-1)[0]).to.not.equal(' ');
            });
        });

        describe('when label is set to a string value', function () {
            beforeEach(function () {
                lines = layout.layoutPoint({
                    "type" : "point",
                    "label" : 'II',
                    "text": "Wants pawn term dare worsted ladle gull hoe hat search putty yowler coils debt pimple colder Guilty Looks. Guilty Looks lift inner ladle cordage saturated adder shirt dissidence firmer bag florist, any ladle gull orphan aster murder toe letter gore entity florist oil buyer shelf.",
                    "body": []
                });
            });

            it('should return a list of lines', function () {
                expect(lines).to.be.an('array');
            });

            it('should split a long line into multiple lines', function () {
                expect(lines).to.have.length(5);
                expect(lines[0]).to.equal('II  Wants pawn term dare worsted ladle gull hoe hat search putty');
                expect(lines[1]).to.equal('    yowler coils debt pimple colder Guilty Looks. Guilty Looks lift');
                expect(lines[2]).to.equal('    inner ladle cordage saturated adder shirt dissidence firmer bag');
                expect(lines[3]).to.equal('    florist, any ladle gull orphan aster murder toe letter gore entity');
                expect(lines[4]).to.equal('    florist oil buyer shelf.');
            });

            it('should have have a hanging indent using a dash as the bullet', function () {
                expect(lines[0].split('').slice(0, 4).join('')).to.equal('II  ');
                expect(lines[1].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[2].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[3].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[4].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[0].split('')[5]).to.not.equal(' ');
                expect(lines[1].split('')[5]).to.not.equal(' ');
                expect(lines[2].split('')[5]).to.not.equal(' ');
                expect(lines[3].split('')[5]).to.not.equal(' ');
                expect(lines[4].split('')[5]).to.not.equal(' ');
            });

            it('should split at space characters', function () {
                expect(lines[0].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[1].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[2].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[3].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[4].split('').slice(-1)[0]).to.not.equal(' ');
            });
        });

        describe('when label is set to a numeric value', function () {
            beforeEach(function () {
                lines = layout.layoutPoint({
                    "type" : "point",
                    "label" : 2,
                    "text": "Wants pawn term dare worsted ladle gull hoe hat search putty yowler coils debt pimple colder Guilty Looks. Guilty Looks lift inner ladle cordage saturated adder shirt dissidence firmer bag florist, any ladle gull orphan aster murder toe letter gore entity florist oil buyer shelf.",
                    "body": []
                });
            });

            it('should return a list of lines', function () {
                expect(lines).to.be.an('array');
            });

            it('should split a long line into multiple lines', function () {
                expect(lines).to.have.length(5);
                expect(lines[0]).to.equal('2   Wants pawn term dare worsted ladle gull hoe hat search putty');
                expect(lines[1]).to.equal('    yowler coils debt pimple colder Guilty Looks. Guilty Looks lift');
                expect(lines[2]).to.equal('    inner ladle cordage saturated adder shirt dissidence firmer bag');
                expect(lines[3]).to.equal('    florist, any ladle gull orphan aster murder toe letter gore entity');
                expect(lines[4]).to.equal('    florist oil buyer shelf.');
            });

            it('should have have a hanging indent using a dash as the bullet', function () {
                expect(lines[0].split('').slice(0, 4).join('')).to.equal('2   ');
                expect(lines[1].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[2].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[3].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[4].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[0].split('')[5]).to.not.equal(' ');
                expect(lines[1].split('')[5]).to.not.equal(' ');
                expect(lines[2].split('')[5]).to.not.equal(' ');
                expect(lines[3].split('')[5]).to.not.equal(' ');
                expect(lines[4].split('')[5]).to.not.equal(' ');
            });

            it('should split at space characters', function () {
                expect(lines[0].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[1].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[2].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[3].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[4].split('').slice(-1)[0]).to.not.equal(' ');
            });
        });

        describe('when label is set to a string that is longer than the indent', function () {
            beforeEach(function () {
                lines = layout.layoutPoint({
                    "type" : "point",
                    "label" : 'VeryLongBullet',
                    "text": "Wants pawn term dare worsted ladle gull hoe hat search putty yowler coils debt pimple colder Guilty Looks. Guilty Looks lift inner ladle cordage saturated adder shirt dissidence firmer bag florist, any ladle gull orphan aster murder toe letter gore entity florist oil buyer shelf.",
                    "body": []
                });
            });

            it('should return a list of lines', function () {
                expect(lines).to.be.an('array');
            });

            it('should split a long line into multiple lines', function () {
                expect(lines).to.have.length(5);
                expect(lines[0]).to.equal('VeryLongBullet Wants pawn term dare worsted ladle gull hoe hat search');
                expect(lines[1]).to.equal('    putty yowler coils debt pimple colder Guilty Looks. Guilty Looks');
                expect(lines[2]).to.equal('    lift inner ladle cordage saturated adder shirt dissidence firmer');
                expect(lines[3]).to.equal('    bag florist, any ladle gull orphan aster murder toe letter gore');
                expect(lines[4]).to.equal('    entity florist oil buyer shelf.');
            });

            it('should have have a hanging indent using a dash as the bullet', function () {
                expect(lines[0].split('').slice(0, 15).join('')).to.equal('VeryLongBullet ');
                expect(lines[1].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[2].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[3].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[4].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[0].split('')[5]).to.not.equal(' ');
                expect(lines[1].split('')[5]).to.not.equal(' ');
                expect(lines[2].split('')[5]).to.not.equal(' ');
                expect(lines[3].split('')[5]).to.not.equal(' ');
                expect(lines[4].split('')[5]).to.not.equal(' ');
            });

            it('should split at space characters', function () {
                expect(lines[0].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[1].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[2].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[3].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[4].split('').slice(-1)[0]).to.not.equal(' ');
            });
        });

        describe('when label is set to a string that is the same length than the indent', function () {
            beforeEach(function () {
                lines = layout.layoutPoint({
                    "type" : "point",
                    "label" : 'III.',
                    "text": "Wants pawn term dare worsted ladle gull hoe hat search putty yowler coils debt pimple colder Guilty Looks. Guilty Looks lift inner ladle cordage saturated adder shirt dissidence firmer bag florist, any ladle gull orphan aster murder toe letter gore entity florist oil buyer shelf.",
                    "body": []
                });
            });

            it('should return a list of lines', function () {
                expect(lines).to.be.an('array');
            });

            it('should split a long line into multiple lines', function () {
                expect(lines).to.have.length(5);
                expect(lines[0]).to.equal('III. Wants pawn term dare worsted ladle gull hoe hat search putty');
                expect(lines[1]).to.equal('    yowler coils debt pimple colder Guilty Looks. Guilty Looks lift');
                expect(lines[2]).to.equal('    inner ladle cordage saturated adder shirt dissidence firmer bag');
                expect(lines[3]).to.equal('    florist, any ladle gull orphan aster murder toe letter gore entity');
                expect(lines[4]).to.equal('    florist oil buyer shelf.');
            });

            it('should have have a hanging indent using a dash as the bullet', function () {
                expect(lines[0].split('').slice(0, 5).join('')).to.equal('III. ');
                expect(lines[1].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[2].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[3].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[4].split('').slice(0, 4).join('')).to.equal('    ');
                expect(lines[0].split('')[5]).to.not.equal(' ');
                expect(lines[1].split('')[5]).to.not.equal(' ');
                expect(lines[2].split('')[5]).to.not.equal(' ');
                expect(lines[3].split('')[5]).to.not.equal(' ');
                expect(lines[4].split('')[5]).to.not.equal(' ');
            });

            it('should split at space characters', function () {
                expect(lines[0].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[1].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[2].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[3].split('').slice(-1)[0]).to.not.equal(' ');
                expect(lines[4].split('').slice(-1)[0]).to.not.equal(' ');
            });
        });
    });
});


              

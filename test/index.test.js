/* jshint node: true, mocha: true */

var expect = require('chai').expect;
var _ = require('lodash');

var now = require('../index.js');

describe('[now]', function() {
    it('is a function', function() {
        expect(now).to.be.a('function');
    });

    it('returns a number in milliseconds', function() {
        [now(), now(), now(), now(), now()].reduce(function(a, b) {
            expect(a).to.be.a('number');
            expect(b).to.be.a('number');
            expect(a).to.be.below(b);
            return b;
        });
    });

    describe('#reset', function() {
        it('resets the absolute 0 time', function(done) {
            function testReset(next) {
                var a = now();

                setTimeout(function() {
                    var b = now();
                    expect(b).to.be.above(a);

                    now.reset();

                    var c = now();
                    expect(c).to.be.below(a).and.to.be.below(b);

                    next();
                }, 1);
            }

            // just for funsies, test it a couple of times
            testReset(testReset(testReset(done)));
        });
    });
});

describe('[now:Timer]', function() {
    it('can be called with the new keyword', function() {
        var timer = new now.Timer();
        expect(timer).to.be.instanceof(now.Timer);
    });
    it('can be called without the new keyword', function() {
        var timer = now.Timer();
        expect(timer).to.be.instanceof(now.Timer);
    });

    it('exposes its default members', function() {
        var timer = now.Timer();

        expect(timer).to.have.property('start').and.to.be.a('function');
        expect(timer).to.have.property('end').and.to.be.a('function');
        expect(timer).to.have.property('report').and.to.be.a('function');
    });

    it('cannot have default members overwritten by options', function() {
        var opts = {
            start: 'string value',
            end: function customEnd() {}
        };

        var timer = now.Timer(opts);

        expect(timer).to.have.property('start').and.to.equal(now.Timer.prototype.start);
        expect(timer).to.have.property('end').and.to.equal(now.Timer.prototype.end);
    });

    it('reports on named timers', function() {
        var timer = now.Timer();
        var NAME = 'llama';

        timer.start(NAME);
        timer.end(NAME);

        var report = timer.report();

        expect(report).to.have.property(NAME)
            .and.to.be.an('object');

        var named = report[NAME];

        expect(named).to.have.all.keys(['start', 'end', 'duration']);
        expect(named).to.have.property('duration').and.to.be.above(0);
    });

    describe('#start', function() {
        var NAME = 'pineapple';

        it('returns this', function() {
            var timer = now.Timer();
            expect(timer.start(NAME)).to.equal(timer);
        });
    });

    describe('#end', function() {
        var NAME = 'pineapple';

        it('returns this when it knows the name', function() {
            var timer = now.Timer();
            timer.start(NAME);
            expect(timer.end(NAME)).to.equal(timer);
        });

        it('returns this when it does not know the name', function() {
            var timer = now.Timer();
            expect(timer.end(NAME)).to.equal(timer);
        });
    });

    describe('#report', function() {
        it('returns the "times" property of the Timer', function() {
            var NAME = 'example';
            var timer = now.Timer();

            timer.start(NAME);
            timer.end(NAME);

			var val = timer.report();

            expect(val).to.deep.equal(timer.times);
            expect(val).to.have.property(NAME)
                .and.to.have.all.keys(['start', 'end', 'duration']);

            _.forEach(val, function(report) {
                expect(report).to.be.instanceOf(now.Report);
            });
        });

        it('allows for custom report properties set through the constructor', function() {
            var NAME = 'example';
            var timer = now.Timer({
                cow: 1
            });

            timer.start(NAME);
            timer.end(NAME);

			var val = timer.report();

            expect(val).to.deep.equal(timer.times);
            expect(val).to.have.property(NAME)
                .and.to.have.all.keys(['start', 'end', 'duration', 'cow']);

            _.forEach(val, function(report) {
                expect(report).to.be.instanceOf(now.Report);
            });
        });

		it('filters out reports that have not completed', function() {
			var timer = now.Timer();
			timer.start(1);
			timer.start(2);

			timer.end(1);

			var val = timer.report();

			expect(val).to.have.property(1);
			expect(val).to.not.have.property(2);
		});
    });

    describe('#duration', function() {
        it('returns the named timer duration', function() {
            var NAME = 'pineapples';
            var timer = now.Timer();

            timer.start(NAME);
            timer.end(NAME);

            var val = timer.duration(NAME);

            expect(val).to.be.a('number').and.to.be.above(0);
            expect(val).to.equal(timer.report()[NAME].end - timer.report()[NAME].start);
        });

        it('returns null if the timer does not exist', function() {
            var NAME = 'pineapples';
            var timer = now.Timer();

            expect(timer.duration(NAME)).to.equal(null);
        });

        it('returns null if the timer has not ended', function() {
            var NAME = 'pineapples';
            var timer = now.Timer();

            timer.start(NAME);

            expect(timer.duration(NAME)).to.equal(null);
        });
    });
});

/* jshint node: true, mocha: true */

var expect = require('chai').expect;
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
            var timer = now.Timer();
            var val = timer.report();
            expect(val).to.equal(timer.times);
        });
    });
});
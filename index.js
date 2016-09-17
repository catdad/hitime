/* jshint node: true */

var _ = require('lodash');

function getNanoSeconds() {
    var hr = process.hrtime();
    return hr[0] * 1e9 + hr[1];
}

var loadTime = getNanoSeconds();

function now() {
    return (getNanoSeconds() - loadTime) / 1e6;
}

function Report() {
    this.start = now();
    this.end = null;
    this.duration = null;
}

function Timer(reportKeys) {
    if (!(this instanceof Timer)) {
        return new Timer(reportKeys);
    }

    this.reporter = _.isPlainObject(reportKeys) ?
        function TimerReport() {
            return _.assign(new Report(), reportKeys);
        } :
        Report;

    this.times = {};
}

Timer.prototype.start = function startTimer(id) {
    // Create this object will of the props it will need in the future.
    this.times[id] = new this.reporter();

    return this;
};

Timer.prototype.end = function endTimer(id) {
    // If this timer does not exist, or if it has already ended,
    // return without updating the data.
    if (!this.times[id] || this.times[id].end !== null) {
        return this;
    }

    this.times[id].end = now();
    this.times[id].duration = this.times[id].end - this.times[id].start;

    return this;
};

Timer.prototype.get = function getTimer(id) {
    // If this timer does not exist, or ig it has not ended,
    // return null
    if (!this.times[id] || this.times[id].end === null) {
        return null;
    }

    return this.times[id].duration;
};

Timer.prototype.report = function reportTimers() {
    // exclude timers that have not been ended
    return _.reduce(this.times, function(seed, time, idx) {
        if (time.end !== null) {
            seed[idx] = time;
        }
        return seed;
    }, {});
};

module.exports = now;
module.exports.Timer = Timer;
module.exports.Report = Report;

module.exports.reset = function resetLoadTime() {
    loadTime = getNanoSeconds();
};

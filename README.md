# hitime

[![Build][1]][2]
[![Test Coverage][3]][4]
[![Code Climate][5]][6]
[![Downloads][7]][8]
[![Version][9]][8]
[![Dependency Status][10]][11]

[1]: https://travis-ci.org/catdad/hitime.svg?branch=master
[2]: https://travis-ci.org/catdad/hitime

[3]: https://codeclimate.com/github/catdad/hitime/badges/coverage.svg
[4]: https://codeclimate.com/github/catdad/hitime/coverage

[5]: https://codeclimate.com/github/catdad/hitime/badges/gpa.svg
[6]: https://codeclimate.com/github/catdad/hitime

[7]: https://img.shields.io/npm/dm/hitime.svg
[8]: https://www.npmjs.com/package/hitime
[9]: https://img.shields.io/npm/v/hitime.svg

[10]: https://david-dm.org/catdad/hitime.svg
[11]: https://david-dm.org/catdad/hitime

:alarm_clock: Hi-res timer for Node, wrapped in some pretty helpers.

## Install

```bash
npm install -S hitime
```

## Use

To get a simple high resolution timestamp:

```javascript
var hitime = require('hitime);

var timestamp = hitime();
```

This will return a decimal number, in milliseconds (so you can still do mental math), accurate to the nanosecond, using Node's native `process.hrtime`. This is a relative time, measured from the time that the module was loaded.

You can compare two timestamps with regular math, because they are just numbers:

```javascript
var a = hitime();
var b = hitime();

var duration = b - a;
```

### Using named timers

Similarly to Chrome's `console.time`, this module gives you named timers, so you can keep easier track of various tasks.

```javascript
var timer = hitime.Timer();

timer.start('my name');

doAsyncWork(function(err) {
    // with high-resolution time, you want
    // to make sure you cann this as soon as possible
    timer.end('my name');
    
    // check for an error now... if statements do cost
    // time, you know
    
    ...
    
    // at some point in the future
    var report = timer.report();
    
    console.log(report['my name'].duration);
});
```

Any timers that have ben registered will appear in the report, containing the following values:

- `start`: the relative start time of the timer
- `end`: the relative end time of the timer
- `duration`: the total time for the timer

"use strict";
const moment = require('moment');
const Tools = require('./tools.js');
const Common = require('./common.js');
Tools.initPolyfill();

const TIMES = [
    { now: moment("03:44:00", Common.FORMAT), res: false },
    { now: moment("04:00:00", Common.FORMAT), res: false },
    { now: moment("04:00:00", Common.FORMAT), res: false },
    { now: moment("04:59:00", Common.FORMAT), res: false },
    { now: moment("05:00:00", Common.FORMAT), res: false},
    { now: moment("05:01:00", Common.FORMAT), res: false },
    { now: moment("05:30:00", Common.FORMAT), res: false },
    { now: moment("05:30:01", Common.FORMAT), res: true },
    { now: moment("06:00:00", Common.FORMAT), res: true },
    { now: moment("06:30:00", Common.FORMAT), res: true },
    { now: moment("06:44:44", Common.FORMAT), res: true },
    { now: moment("07:06:06", Common.FORMAT), res: true },
    { now: moment("07:29:00", Common.FORMAT), res: true },
    { now: moment("07:29:59", Common.FORMAT), res: true },
    { now: moment("07:30:00", Common.FORMAT), res: false },
    { now: moment("07:30:01", Common.FORMAT), res: false },
    { now: moment("07:40:00", Common.FORMAT), res: false },
    { now: moment("08:30:00", Common.FORMAT), res: false },
];

console.log("Today: " + moment().weekday());
for(var info of TIMES) {
    const now = info.now;
    console.log("TIME: " + now.format());
    const weekday = now.weekday();
    console.log(`day [${weekday}] \t inDays [${Tools.correctDay(weekday, Common.SCAN_WEEK_DAYS)}] \t gt [${Tools.gt(now, Common.SCAN_TIME[0])}] \t lt [${Tools.lt(now, Common.SCAN_TIME[1])}] \t  `);
    if(!Tools.correctRange(weekday, Common.SCAN_WEEK_DAYS, now, Common.SCAN_TIME)) {
        console.log('Result correct: ' + (info.res === false))
    } else {
        console.log('Result correct: ' + (info.res === true))
    }
    if(Tools.eq(now, Common.SCAN_TIME[0]) === true) {
        console.log('cleaning');
    }
    if(Tools.eq(now, Common.SCAN_TIME[1]) === true) {
        console.log('end of scan time');
    }
}

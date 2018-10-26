"use strict";
const moment = require('moment');
const Tools = require('../tools.js');
const Common = require('../common.js');
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

for(var info of TIMES) {
    const scanTime = Common.getScanTime();
    const now = info.now;
    console.log(`day [${now.weekday()}] \t inDays [${Tools.correctDay(now.weekday(), Common.SCAN_WEEK_DAYS)}] \t gt [${Tools.gt(now, scanTime[0])}] \t lt [${Tools.lt(now, scanTime[1])}] \t  `);
    if(Tools.correctRange(now, Common.SCAN_WEEK_DAYS, scanTime) === false) {
        console.log('Result correct: ' + (info.res === false))
    } else {
        console.log('Result correct: ' + (info.res === true))
    }
    if(Tools.eq(now, scanTime[0]) === true) {
        console.log('cleaning');
    }
    if(Tools.eq(now, scanTime[1]) === true) {
        console.log('end of scan time');
    }
}
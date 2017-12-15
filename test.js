"use strict";
const moment = require('moment');
const Tools = require('./tools.js');

Tools.initPolyfill();
const FORMAT = "HH:mm:ss";
const TIMES = [
    { now: moment("03:44:00", FORMAT), res: false },
    { now: moment("04:00:00", FORMAT), res: false },
    { now: moment("04:00:00", FORMAT), res: false },
    { now: moment("04:59:00", FORMAT), res: false },
    { now: moment("05:00:00", FORMAT), res: false},
    { now: moment("05:01:00", FORMAT), res: false },
    { now: moment("05:31:00", FORMAT), res: true },
    { now: moment("06:00:00", FORMAT), res: true },
    { now: moment("06:30:00", FORMAT), res: true },
    { now: moment("06:44:44", FORMAT), res: true },
    { now: moment("07:06:06", FORMAT), res: true },
    { now: moment("07:29:00", FORMAT), res: true },
    { now: moment("07:29:59", FORMAT), res: true },
    { now: moment("07:30:00", FORMAT), res: false },
    { now: moment("07:40:00", FORMAT), res: false },
    { now: moment("08:30:00", FORMAT), res: false },
];

const SCAN_TIME = [moment("05:30:00", FORMAT), moment("07:30:00", FORMAT)];
const SCAN_WEEK_DAYS = [1, 2, 3, 5];

console.log("Today: " + moment().weekday());
for(var info of TIMES) {
    const now = info.now;
    console.log("TIME: " + now.format());
    const weekday = now.weekday();
    if(!SCAN_WEEK_DAYS.includes(weekday) ||
        now <= SCAN_TIME[0] ||
        now >= SCAN_TIME[1]) {
        console.log('Result correct: ' + (info.res === false))
    } else {
        if(now === SCAN_TIME[0]) {
            console.log('cleaning');
        }
        if(now === SCAN_TIME[1]) {
            console.log('end of scan time');
        }
        console.log('handling right now');
        console.log('Result correct: ' + (info.res === true))
    }
}

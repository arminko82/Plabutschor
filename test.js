"use strict";
const moment = require('moment');
const Tools = require('./tools.js');

Tools.initPolyfill();

const TIMES = [
    { now: moment("20171205034400", "YYYYMMDDHHmmss"), res: false },
    { now: moment("20171205040000", "YYYYMMDDHHmmss"), res: false },
    { now: moment("20171205040000", "YYYYMMDDHHmmss"), res: false },
    { now: moment("20171205045900", "YYYYMMDDHHmmss"), res: false },
    { now: moment("20171205050000", "YYYYMMDDHHmmss"), res: false},
    { now: moment("20171205050100", "YYYYMMDDHHmmss"), res: false },
    { now: moment("20171205053100", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205060000", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205063000", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205064444", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205070606", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205075900", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205075959", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205080000", "YYYYMMDDHHmmss"), res: false }
];

const SCAN_TIME = [5 * 60 * 60 + 30, 7 * 60 * 60 + 59];
const SCAN_WEEK_DAYS = [1, 2, 3, 5];

for(var info of TIMES) {
    const now = info.now;
    console.log("TIME: " + now.format());
    const weekday = now.weekday();
    const nowSecondsOfDay = Tools.getTotalSecondsOfDay(now);

    if(!SCAN_WEEK_DAYS.includes(weekday) ||
        nowSecondsOfDay < SCAN_TIME[0] ||
        nowSecondsOfDay > SCAN_TIME[1]) {
        console.log('Result correct: ' + (info.res === false))
    } else {
        if(nowSecondsOfDay === SCAN_TIME[0]) {
            console.log('cleaning');
        }
        if(nowSecondsOfDay === SCAN_TIME[1]) {
            console.log('end of scan time');
        }
        console.log('handling right now');
        console.log('Result correct: ' + (info.res === true))
    }
}

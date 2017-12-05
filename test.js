"use strict";
const moment = require('moment');

const SCAN_TIME_RANGE = [5, 7];
const SCAN_WEEK_DAYS = [1, 2, 3, 5];

const TIMES = [
    { now: moment("20171205030000", "YYYYMMDDHHmmss"), res: false },
    { now: moment("20171205040000", "YYYYMMDDHHmmss"), res: false },
    { now: moment("20171205040000", "YYYYMMDDHHmmss"), res: false },
    { now: moment("20171205045900", "YYYYMMDDHHmmss"), res: false },
    { now: moment("20171205050000", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205050100", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205051000", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205060000", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205063000", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205064444", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205070606", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205075900", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205075959", "YYYYMMDDHHmmss"), res: true },
    { now: moment("20171205080000", "YYYYMMDDHHmmss"), res: false }
];

for(var info of TIMES) {
    const now = info.now;
    console.log("TIME: " + now.format());
    const minute = now.minute();
    const hour = now.hour();
    const weekday = now.weekday();
    console.log(`Read time is ${hour}:${minute}`);
    if(!SCAN_WEEK_DAYS.includes(weekday) ||
        SCAN_TIME_RANGE[0] > hour ||
        SCAN_TIME_RANGE[1] < hour) {
        console.log('Result correct: ' + (info.res === false))
    } else {
        if(hour === SCAN_TIME_RANGE[0] && minute === 0) {
            console.log('cleaning');
        }
        if(hour === SCAN_TIME_RANGE[1] && minute === 59) {
            console.log('end of scan time');
        }
        console.log('handling right now');
        console.log('Result correct: ' + (info.res === true))
    }
}

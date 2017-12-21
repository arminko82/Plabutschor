"use strict";
const moment = require('moment');

const DAY_MS = 86400000;
const FORMAT = "HH:mm:ss";
const SCAN_WEEK_DAYS = [1, 2, 3, 4];
const START_TIME = "05:30:00";
const END_TIME = "07:30:00";

function getScanTime() {
    return [moment(START_TIME, FORMAT), moment(END_TIME, FORMAT)];
}

if(typeof module !== 'undefined') {
    module.exports = {
        FORMAT,
        getScanTime,
        SCAN_WEEK_DAYS
    };
}

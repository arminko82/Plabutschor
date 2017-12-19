"use strict";
const moment = require('moment');

const FORMAT = "HH:mm:ss";
const SCAN_TIME = [moment("05:30:00", FORMAT), moment("10:30:00", FORMAT)];
const SCAN_WEEK_DAYS = [1, 2, 3, 5];

if(typeof module !== 'undefined') {
    module.exports = {
        FORMAT,
        SCAN_TIME,
        SCAN_WEEK_DAYS
    };
}

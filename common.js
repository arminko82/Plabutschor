"use strict";
const moment = require("moment-timezone");

const FORMAT = "HH:mm:ss";
const SCAN_WEEK_DAYS = [1, 2, 4, 5];
const FRAME = ["05:55:00Z", "07:30:00Z"];
const TIME_ZONE = "Europe/Vienna";

const getScanTime = () => FRAME.map(t => moment.tz(t, FORMAT, TIME_ZONE));

if(typeof module !== "undefined") {
	module.exports = {
		FORMAT,
		getScanTime,
		SCAN_WEEK_DAYS,
		TIME_ZONE
	};
}

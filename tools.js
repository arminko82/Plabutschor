"use strict";

const moment = require("moment");
const fs = require("fs");
const path = require("fs");

const LOG_TRACE = false;

class Tools {
	static log(msg) {
		let time = new moment(new Date()).format("L LTS");
		console.log(`[${time}] ${msg}`);
	}

	static trace(msg) {
		if(LOG_TRACE)
			Tools.log(msg);
	}

	// Takes a relative path (e.g. data/foo.bar) and appends if to full app path
	static readLines(relativePath) {
		const appDir = path.dirname(require.main.filename);
		const fullPath = path.join(appDir, relativePath);
		const lines = fs.readFileSync(fullPath, "utf-8").split(/\r?\n/);
		return lines;
	}

	static initPolyfill() {
		if (!Array.prototype.includes) {
			Array.prototype.includes = function(searchElement /*, fromIndex*/) {
				if (this == null) {
					throw new TypeError("Array.prototype.includes called on null or undefined");
				}

				var O = Object(this);
				var len = parseInt(O.length, 10) || 0;
				if (len === 0) {
					return false;
				}
				var n = parseInt(arguments[1], 10) || 0;
				var k;
				if (n >= 0) {
					k = n;
				} else {
					k = len + n;
					if (k < 0) {k = 0;}
				}
				var currentElement;
				while (k < len) {
					currentElement = O[k];
					if (searchElement === currentElement ||
                        (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
						return true;
					}
					k++;
				}
				return false;
			};
		}
	}
	static lt(moment1, moment2) { return moment1 < moment2; }
	static gt(moment1, moment2) { return moment1 > moment2;}
	static eq(moment1, moment2) { return moment1.isSame(moment2) === true;}
	static correctDay(day, days) { return days.includes(day) === true;}
	static inRange(now, range) { return Tools.gt(now, range[0]) && Tools.lt(now, range[1]); }
	static correctRange(now, days, range) {
		return this.correctDay(now.weekday(), days) && this.inRange(now, range);
	}
}

if(typeof module !== "undefined") {
	module.exports = Tools;
}

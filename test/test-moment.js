"use strict";

const moment = require('moment-timezone');
const Tools = require('../tools.js');
const Common = require('../common.js');
const {expect} = require("chai");
Tools.initPolyfill();

describe("Time patterns for the cron job should act as expected", function() {  
    it("should only trigger on certain days", () => {
        const monday = moment("2018-12-10T12:00:00Z");
        const tuesday = moment("2018-12-11T12:00:00Z");
        const wednesday = moment("2018-12-12T12:00:00Z");
        const thursday = moment("2018-12-13T12:00:00Z");
        const friday = moment("2018-12-14T12:00:00Z");
        const activeDays = Common.SCAN_WEEK_DAYS;
        const test = d => Tools.correctDay(d.weekday(), activeDays);
        
        expect(test(monday)).to.be.true;
        expect(test(tuesday)).to.be.true;
        expect(test(wednesday)).to.be.false;
        expect(test(thursday)).to.be.true;
        expect(test(friday)).to.be.true;
    });
    
    it("should interpret local time ifentically to UTC during winter in my region.", () => {
        const TIME = "05:55:00";
        const utcTime = moment(TIME, Common.FORMAT);
        const localTime = moment.tz(TIME, Common.FORMAT, Common.TIME_ZONE);
        expect(utcTime.hours()).to.be.equal(5, utcTime.hours());
        expect(localTime.hours()).to.be.equal(5); // all internall equal
    });
    
	it("should determine trigger time correctly", () => {
        const scanTime = Common.getScanTime();
        const times = [
            ["03:44:00",false ],
            ["04:00:00",false ],
            ["04:59:00",false ],
            ["05:00:00",false],
            ["05:01:00",false ],
            ["05:30:00",false ],
            ["05:30:01",false ],
            ["06:00:00",true ],
            ["06:30:00",true ],
            ["06:44:44",true ],
            ["07:06:06",true ],
            ["07:29:00",true ],
            ["07:29:59",true ],
            ["07:30:00",false ],
            ["07:30:01",false ],
            ["07:40:00",false ],
            ["08:30:00",false ]
        ].map(p => [ moment.tz(p[0], Common.FORMAT, Common.TIME_ZONE), p[1]]);
        for(var info of times) {
            const saysIsCorrect = Tools.inRange(info[0], scanTime);
            expect(saysIsCorrect).to.equal(info[1], JSON.stringify(info));
        }
    });
});
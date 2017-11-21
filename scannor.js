"use strict";

const USE_TEST_INPUT = true;
const ARCHIVE = true;

const https = require('https');
const fs = require('fs');
const moment = require('moment');
const Tools = require('./tools.js');
const archive = require('./archive.js');

const SOURCE = "https://www.oeamtc.at/verkehrsservice/proxy.php?url=current/?count=9999&include=cameras";
const TUNNEL = "Plabutsch";
const BLOCKAGE = 'Sperre';
const DESC_ID = 'oeamtc.long-description';
const TIME_ID = 'oeamtc.start-time';

function accountPotentialBlockage(reactor) {
    fetchTraffic(decider, reactor);

    function decider(data) {
        if(data === null) {
            Tools.log("Could not fetch data.");
            return false; // end handling
        }
        let traffic = JSON.parse(data)
            ['contents']['oeamtc.traffic-searchresult']['oeamtc.list']['oeamtc.traffic'];
        for(let test of [ isTunnelBlocked, isExpresswayBlocked ]) {
            let report = test(traffic);
            if(report !== null) {
                reactor(report);
                return true; // done on first encounter and signal handled
            }
        }
        return false;
    }

    function isTunnelBlocked(traffic) {
        const ID = 'A9';
        var incident = traffic.find(
            n => n["oeamtc.routeId"] === ID && n["oeamtc.type"] === BLOCKAGE &&
            n[DESC_ID].indexOf(TUNNEL) !== -1 && isToday(n));
        return incident === undefined ? null : incident[DESC_ID];
    }

    function isExpresswayBlocked(traffic) {
        const ID = 'S35';
        var incident = traffic.find(
            n => n["oeamtc.routeId"] === ID && n ["oeamtc.type"] === BLOCKAGE &&
            isToday(n));
        return incident === undefined ? null : incident[DESC_ID];
    }

    function isToday (n) {
        return moment(n[TIME_ID]).isSame(moment(), 'day');
    }
}

function fetchTraffic(decider) {
    if(USE_TEST_INPUT) {
        decider(fs.readFileSync('test.json'));
    } else {
        https.get(SOURCE, (resp) => {
            let data = '';
            resp.on('data', (chunk) => data += chunk);
            resp.on('end', () =>  {
                var incidentFound = decider(data);
                if(ARCHIVE && incidentFound) {
                    archive(data);
                }
            });
        }).on('error', (err) => decider(null));
    }
}

var m = moment();
console.log(m);

if(typeof module !== 'undefined') {
    module.exports = accountPotentialBlockage;
}

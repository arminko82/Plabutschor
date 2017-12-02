"use strict";

const USE_TEST_INPUT = false;
const ARCHIVE = true;

const fs = require('fs');
const moment = require('moment');
const Tools = require('./tools.js');
const archive = require('./archive.js');

//const scannor = require('./scannor-oeamtc.js');
const scannor = require('./scannor-oe3.js');

function accountPotentialBlockage(reactor) {
    fetchTraffic(decider, reactor);

    function decider(data) {
        if(data === null) {
            Tools.log("Could not fetch data.");
            return false; // end handling
        }
        let traffic = scannor.fetch(data);
        for(let test of [ scannor.isTunnelBlocked, scannor.isExpresswayBlocked ]) {
            let report = test(traffic);
            if(report !== null) {
                reactor(report);
                return true; // done on first encounter and signal handled
            }
        }
        return false;
    }

    function isToday (n) {
        const time = n[TIME_ID];
        const now = moment();
        const result = moment(time).isSame(now, 'day');
        return result;
    }
}

function fetchTraffic(decider) {
    if(USE_TEST_INPUT) {
        decider(fs.readFileSync('test-oe3.json'));
    } else {
        scannor.loader.get(scannor.SOURCE, (resp) => {
            let data = '';
            resp.on('data', (chunk) => data += chunk);
            resp.on('end', () =>  {
                var incidentFound = decider(data);
                if(ARCHIVE && incidentFound) {
                    archive.store(data);
                }
            });
        }).on('error', (err) => decider(null));
    }
}

if(typeof module !== 'undefined') {
    module.exports = accountPotentialBlockage;
}

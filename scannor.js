"use strict";

const USE_TEST_INPUT = false;
const ARCHIVE = true;

const https = require('https');
const fs = require('fs');
const Tools = require('./tools.js');
const archive = require('./archive.js');

const SOURCE = "https://www.oeamtc.at/verkehrsservice/proxy.php?url=current/";
const TUNNEL = "Plabutsch";
const BLOCKAGE = 'Sperre';
const DESC_ID = 'oeamtc.long-description';

function accountPotentialBlockage(reactor) {
    fetchTraffic(decider, reactor);

    function decider(data) {
        if(data === null) {
            Tools.log("Could not fetch data.");
            return; // end handling
        }
        let traffic = JSON.parse(data)
            ['contents']['oeamtc.traffic-searchresult']['oeamtc.list']['oeamtc.traffic'];
        for(let test of [ isTunnelBlocked, isExpresswayBlocked ]) {
            let report = test(traffic);
            if(report !== null) {
                reactor(report);
                break; // done on first encounter
            }
        }
    }

    function isTunnelBlocked(traffic) {
        const ID = 'A9';
        var incident = traffic.find(
            n => n["oeamtc.routeId"] === ID && n["oeamtc.type"] === BLOCKAGE &&
            n[DESC_ID].indexOf(TUNNEL) !== -1);
        return incident === undefined ? null : incident[DESC_ID];
    }

    function isExpresswayBlocked(traffic) {
        const ID = 'S35';
        var incident = traffic.find(
            n => n["oeamtc.routeId"] === ID && n ["oeamtc.type"] === BLOCKAGE);
        return incident === undefined ? null : incident[DESC_ID];
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
                decider(data);
                if(ARCHIVE) {
                    archive(data);
                }
            });
        }).on('error', (err) => decider(null));
    }
}

if(typeof module !== 'undefined') {
    module.exports = accountPotentialBlockage;
}

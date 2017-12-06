"use strict";

const http = require("http");
const exec = require('child_process').exec;
const isRouteBlocked = require('./scannor.js');
const Tools = require('./tools.js');
const express = require('express');
const archive = require('./archive.js');
const moment = require('moment');

/*
 * Main switsches
 */
const ENABLE_CRON = true;
const ENABLE_FRONTEND = true;
const ENABLE_DIRECT_CALL = false;
const USE_TEST_INTERVAL = false;

const FRONTEND_BASE_DIR = 'frontend';
const FRONTEND_PORT = 8081;
const PLAYBACK_APP = 'aplay'; // afplay on osx, aplay on raspian

const SCAN_TIME_RANGE = [5, 7];
const SCAN_WEEK_DAYS = [1, 2, 3, 5];

const mApp = express();
var mCurrentAlarmProcess = null;
var mAlarmReportedToday = false;
var mKeepAlertAlive = false;

// Global init and config
function init() {
    Tools.initPolyfill();
    if(ENABLE_CRON) {
        setInterval(function() {
            const now = moment();
            const minute = now.minute();
            const hour = now.hour();
            if(!SCAN_WEEK_DAYS.includes(weekday) ||
                SCAN_TIME_RANGE[0] > hour ||
                SCAN_TIME_RANGE[1] < hour) {
                Tools.trace(" <------------------------: -");
                return;
            }
            Tools.trace(" <------------------------: +");
            if(hour === SCAN_TIME_RANGE[0] && minute === 0) {
                cleanJob();
            }
            if(hour === SCAN_TIME_RANGE[1] + 1 && minute === 0) {
                endOfTodaysScanJob();
            }
            trafficScanJob();
        }, 60000); // check minutely

        const trafficScanJob = function() {
            Tools.log("Beginning scan.");
            isRouteBlocked(reactOnBlockage);
            Tools.log("End scan.");
        };
        const endOfTodaysScanJob = function() {
            Tools.log("Cleaning up afterwards.");
            mAlarmReportedToday = false;
            killAlert();
        };
        const cleanJob = function() {
            Tools.log("Initializing main cron job.");
            archive.clear();
            Tools.log("Initialized main cron job.");
        };
    }
    if(ENABLE_FRONTEND) {
        http.createServer(mApp).listen(FRONTEND_PORT);
        mApp.get("/", (req, res) => send(res, 'index.html'));
        mApp.get("/deactive", (req, res) => {
            killAlert();
            send(res, 'done.html');
        });

        function send(res, item) {
            res.sendFile(item, {root: FRONTEND_BASE_DIR});
        }
        Tools.log("Server runs at port " + FRONTEND_PORT);
    }
}

function reactOnBlockage(reportText) {
    if(mAlarmReportedToday) {
        return; // do not alarm again
    }
    mAlarmReportedToday = true;
    mKeepAlertAlive = true;
    Tools.log('Reporting incident: ' + reportText);

    const script = [
        `${PLAYBACK_APP} sound0.wav`,
        `sleep 1`,
        `${PLAYBACK_APP} sound0.wav`,
        `sleep 1`,
        `${PLAYBACK_APP} sound0.wav`,
        `sleep 1`,
        `espeak "${reportText}" -v german`,
        `sleep 1`,
        `${PLAYBACK_APP} sound2.wav`,
        `sleep 1`
    ];
    var index = 0;
    const fork = (cb) => exec(script[index++ % script.length], cb);
    const cb = (err, stdout, stderr) => {
        if (err) {
            Tools.log('FAILED to report incident: ' + err);
            killAlert();
            return;
        }
        if(mKeepAlertAlive) {
            mCurrentAlarmProcess = fork(cb);
        }
    };
    mCurrentAlarmProcess = fork(cb);
}

function killAlert() {
    mKeepAlertAlive = false;
    if(mCurrentAlarmProcess !== null) {
        mCurrentAlarmProcess.kill();
        mCurrentAlarmProcess = null;
    }
}

init();

if(ENABLE_DIRECT_CALL) {
    isRouteBlocked(reactOnBlockage);
}

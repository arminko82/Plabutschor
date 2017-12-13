"use strict";

const http = require("http");
const exec = require('child_process').exec;
const isRouteBlocked = require('./scannor.js');
const Tools = require('./tools.js');
const express = require('express');
const archive = require('./archive.js');
const moment = require('moment');

/*
 * Main switches
 */
const ENABLE_CRON = false;
const ENABLE_FRONTEND = true;
const ENABLE_DIRECT_CALL = false;
const USE_TEST_INTERVAL = false;

const FRONTEND_BASE_DIR = 'frontend';
const FRONTEND_PORT = 8081;
const PLAYBACK_APP = 'aplay'; // afplay on osx, aplay on raspian

const FORMAT = "HH:mm:ss";
const SCAN_TIME = [moment("05:30:00", FORMAT), moment("07:30:00", FORMAT)];
const SCAN_WEEK_DAYS = [1, 2, 3, 5];

const mApp = express();
var mCurrentAlarmProcess = null;
var mAlarmReportedToday = false;
var mKeepAlertAlive = false;
var mReportText = "";

// Global init and config
function init() {
    Tools.initPolyfill();
    Tools.log("Starting service, setting up ...");
    if(ENABLE_CRON) {
        setInterval(function() {
            const now = moment();
            const weekday = now.weekday();
            if(!SCAN_WEEK_DAYS.includes(weekday) || now <= SCAN_TIME[0] || now >= SCAN_TIME[1]) {
                Tools.trace(" <------------------------: -");
                return;
            }
            Tools.trace(    " <------------------------: +");
            if(now === SCAN_TIME[0]) {
                cleanJob();
            }
            if(now === SCAN_TIME[1]) {
                endOfTodaysScanJob();
            }
            trafficScanJob();
        }, 60000); // check minutely

        const trafficScanJob = function() {
            Tools.trace("Beginning scan.");
            isRouteBlocked(reactOnBlockage);
            Tools.trace("End scan.");
        };
        const endOfTodaysScanJob = function() {
            Tools.trace("Cleaning up afterwards.");
            mAlarmReportedToday = false;
            mReportText = "";
            killAlert();
        };
        const cleanJob = function() {
            Tools.trace("Initializing main cron job.");
            archive.clear();
            Tools.trace("Initialized main cron job.");
        };
    }
    if(ENABLE_FRONTEND) {
        http.createServer(mApp).listen(FRONTEND_PORT);
        mApp.get("/", (req, res) => send(res, 'index.html'));
        mApp.get("/reason", (req, res) => res.send(mReportText));
        mApp.get("/deactive", (req, res) => {
            killAlert();
            send(res, 'done.html');
        });

        function send(res, item) {
            res.sendFile(item, {root: FRONTEND_BASE_DIR});
        }
        Tools.log("Server runs at port " + FRONTEND_PORT);
    }
    Tools.log("Init finalized.");
}

function reactOnBlockage(reportText) {
    if(mAlarmReportedToday) {
        return; // do not alarm again
    }
    mAlarmReportedToday = true;
    mKeepAlertAlive = true;
    mReportText = reportText;
    const logMsg = 'Reporting incident: ' + reportText;
    Tools.log(logMsg);
    //Tools.sendMail(logMsg);
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

"use strict";

const http = require("http");
const exec = require('child_process').exec;
const isRouteBlocked = require('./scannor.js');
const Tools = require('./tools.js');
const express = require('express');
const archive = require('./archive.js');
const moment = require('moment');
const Common = require('./common.js');
const SmsSender = require('./sms-sender.js');

/*
 * Main switches
 */
const ENABLE_CRON = true;
const ENABLE_FRONTEND = true;
const ENABLE_DIRECT_CALL = false;
const USE_TEST_INTERVAL = false;

const FRONTEND_BASE_DIR = 'frontend';
const FRONTEND_PORT = 8081;
const PLAYBACK_APP = 'aplay'; // afplay on osx, aplay on raspian

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
            const scanTime = Common.getScanTime();
            const now = moment();
            const weekday = now.weekday();
            Tools.trace(now);
            if(Tools.correctRange(now, Common.SCAN_WEEK_DAYS, scanTime) === false) {
                Tools.trace(" <------------------------: -");
                return;
            }
            Tools.trace(    " <------------------------: +");
            if(Tools.eq(now, scanTime[0]) === true) {
                cleanJob();
            }
            if(Tools.eq(now, scanTime[1]) === true) {
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
            Tools.log("Cleaning up for today.");
            mAlarmReportedToday = false;
            mReportText = "";
            killAlert();
        };
        const cleanJob = function() {
            archive.clear();
            Tools.log("Deleted yesterdays data.");
        };
    }
    if(ENABLE_FRONTEND) {
        http.createServer(mApp).listen(FRONTEND_PORT);
        mApp.use(express.static(FRONTEND_BASE_DIR));
        mApp.get("/", (req, res) => send(res, 'index.html'));
        mApp.get("/reason", (req, res) => res.send(mReportText));
        mApp.get("/deactivateAlarm", (req, res) => {
            killAlert();
            send(res, 'done.html');
        });
        mApp.get("/reportMissedCall", (req, res) => {
            reportMissedCall();
            send(res, 'done.html');
        });
        mApp.get("/getPreparedSMS", (req, res) => send(res, 'preparedMessages.txt', "data"));
        mApp.get('/sendGroupSMS', (req, res) => {
            try {
                const index = req.query.sms;
                var path = require('path');
                var appDir = path.dirname(require.main.filename);
                var file = path.join(appDir, "data/preparedMessages.txt");
                var sms = require('fs').readFileSync(file, 'utf-8').split(/\r?\n/)[index];
                if(!str || 0 === str.length)
                    throw "No value found.";
                SmsSender.broadcast(sms);
                res.end("OK");
            } catch(ex) {
                res.end("ERROR");
            }
        });
        function send(res, item, rootFolder=FRONTEND_BASE_DIR) {
            res.sendFile(item, {root: rootFolder});
        }
        Tools.log("Server runs at port " + FRONTEND_PORT);
    }
    Tools.log("Init finalized.");
}

// Speaks a message over the alarm system.
function reportMissedCall() {
    const command = 'espeak "Seine herrliche Lordschaft hatte versucht anzurufen." -v german';
    exec(command);
}

function reactOnBlockage(reportText) {
    if(mAlarmReportedToday) {
        return; // do not alarm again
    }
    mAlarmReportedToday = true;
    mKeepAlertAlive = true;
    mReportText = `[${new Date()}]${reportText}`;
    const logMsg = 'Reporting incident: ' + reportText;
    Tools.log(logMsg);
    //Tools.sendMail(logMsg);
    const script = [
        `${PLAYBACK_APP} data/sound0.wav`,
        `sleep 1`,
        `${PLAYBACK_APP} data/sound0.wav`,
        `sleep 1`,
        `${PLAYBACK_APP} data/sound0.wav`,
        `sleep 1`,
        `espeak "${reportText}" -v german`,
        `sleep 1`,
        `${PLAYBACK_APP} data/sound2.wav`,
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

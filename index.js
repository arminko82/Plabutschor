"use strict";

const http = require("http");
const CronJob = require('cron').CronJob;
const exec = require('child_process').exec;
const isRouteBlocked = require('./scannor.js');
const Tools = require('./tools.js');
const express = require('express');
const archive = require('./archive.js');

/*
 * Main switsches
 */
const ENABLE_CRON = true;
const ENABLE_FRONTEND = true;
const ENABLE_DIRECT_CALL = false;
const USE_TEST_INTERVAL = false;
const FORCE_CRON_JUMP_START = true;

const FRONTEND_BASE_DIR = 'frontend';
const FRONTEND_PORT = 8081;
const PLAYBACK_APP = 'aplay'; // afplay on osx, aplay on raspian

//  monday, tuesday, wednesday and friday every minute between 05:00 and 08:00
const CRON_INTERVALS = '00 * 5-8 * * 1-3,5';
const CRON_BEFORE =     '00 59 4 * * 1-3,5';
const CRON_AFTER =       '00 01 8 * * 1-3,5';
const TEST_INTERVALS = '00 * * * * *';

const mApp = express();
var mCurrentAlarmProcess = null;
var mAlarmReportedToday = false;
var mKeepAlertAlive = false;

// Global init and config
function init() {
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

    if(ENABLE_CRON) {
        const interval = USE_TEST_INTERVAL ? TEST_INTERVALS : CRON_INTERVALS;
        const zone = 'Europe/Vienna';
        // central job
        new CronJob(interval, function() {
            Tools.log("Beginning scan.");
            isRouteBlocked(reactOnBlockage);
            Tools.log("End scan.");
        }, null, FORCE_CRON_JUMP_START, zone);
        // cleanup job
        new CronJob(CRON_AFTER, function() {
            Tools.log("Cleaning up afterwards.");
            mAlarmReportedToday = false;
            killAlert();
        }, null, FORCE_CRON_JUMP_START, zone);
        new CronJob(CRON_BEFORE, function() {
            Tools.log("Initializing main cron job.");
            archive.clear();
            Tools.log("Initialized main cron job.");
        }, null, FORCE_CRON_JUMP_START, zone);
    }
}

function reactOnBlockage(reportText) {
    if(mAlarmReportedToday) {
        return; // to not alarm again
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

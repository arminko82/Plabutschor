"use strict";

const http = require("http");
const CronJob = require('cron').CronJob;
const exec = require('child_process').exec;
const isRouteBlocked = require('./scannor.js');
const Tools = require('./tools.js');
const express = require('express');

/*
 * Main switsches
 */
const ENABLE_CRON = true;
const ENABLE_FRONTEND = true;
const ENABLE_DIRECT_CALL = false;
const USE_TEST_INTERVAL = false;

const FRONTEND_BASE_DIR = '.';
const FRONTEND_PORT = 8081;

//  monday, tuesday, wednesday and friday every minute between 05:00 and 08:00
const CRON_INTERVALS = '00 * 5-8 * * 1-3,5';
const TEST_INTERVALS = '00 * * * * *';

const mApp = express();
var mCurrentAlarmProcess = null;

// Global init and config
function init() {
    if(ENABLE_FRONTEND) {
        http.createServer(mApp).listen(FRONTEND_PORT);
        mApp.get("/", (req, res) => send(res, 'index.html'));
        mApp.get("/deactive", (req, res) => {
            if(mCurrentAlarmProcess !== null) {
                mCurrentAlarmProcess.kill();
                mCurrentAlarmProcess = null;
            }
            send(res, 'done.html');
        });

        function send(res, item) {
            res.sendFile(item, {root: FRONTEND_BASE_DIR});
        }
        Tools.log("Server runs at port " + FRONTEND_PORT);
    }

    if(ENABLE_CRON) {
        const interval = USE_TEST_INTERVAL ? TEST_INTERVALS : CRON_INTERVALS;
        new CronJob(interval, function() {
            isRouteBlocked(reactOnBlockage);
        }, null, true, 'Europe/Vienna');
    }
}

// bool parameter
function reactOnBlockage(reportText) {
    Tools.log('Reporting incident: ' + reportText);
    mCurrentAlarmProcess = exec(`espeak "${reportText}" -v german`,
        (err, stdout, stderr) => {
            if (err) {
                Tools.log('FAILED to report incident.');
                return;
            }
        });
}

if(ENABLE_DIRECT_CALL)
    isRouteBlocked(reactOnBlockage);
init();

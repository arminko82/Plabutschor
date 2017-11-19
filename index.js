"use strict";

const http = require("http");
const CronJob = require('cron').CronJob;
const exec = require('child_process');
const isRouteBlocked = require('./scannor.js');
const Tools = require('./tools.js');

const ENABLE_CRON = false;
const ENABLE_FRONTEND = false;
const ENABLE_DIRECT_CALL = true;

const FRONTEND_PORT = 8081;
//  monday, tuesday, wednesday and friday every minute between 05:00 and 08:00
const CRON_INTERVALS = '00 * 5-8 * * 1-3,5';

// Global init and config
function init() {
    if(ENABLE_FRONTEND) {
        http.createServer(app).listen(FRONTEND_PORT);
        app.get("/", function(req, res) {
            send(res, 'index.html');
            //   response.writeHead(200, {'Content-Type': 'text/plain'});
            // Send the response body as "Hello World"
            //   response.end('Hello World\n');
        });
    }
    if(ENABLE_CRON) {
        new CronJob(CRON_INTERVALS, function() {
            isRouteBlocked(reactOnBlockage);
        }, null, true, 'Europe/Vienna');
    }
}

// bool parameter
function reactOnBlockage(reportText) {
    Tools.log('Reporting incident: ' + reportText);
    exec(`espeak "${reportText}" -v german`, (err, stdout, stderr) => {
        if (err) {
            Tools.log('FAILED to report incident.');
            return;
        }
    });
}

if(ENABLE_DIRECT_CALL)
    isRouteBlocked(reactOnBlockage);
init();

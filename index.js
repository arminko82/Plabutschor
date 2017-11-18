"use strict";

const PORT = 8081;

const http = require("http");
const app = require('express')();
const CronJob = require('cron').CronJob;
const { exec } = require('child_process');
const isRouteBlocked = require('./scannor.js');
const Tools = require('./Tools.js');

// Global init and config
function init() {
    http.createServer(app).listen(PORT);

    app.get("/", function(req, res) {
        send(res, 'index.html');
        //   response.writeHead(200, {'Content-Type': 'text/plain'});
        // Send the response body as "Hello World"
        //   response.end('Hello World\n');
    });

    //  monday, turesday, wednesday and friday every second between 05:00 and 08:00
    new CronJob('00 * 5-8 * * 1-3,5', function() {
        isRouteBlocked(reactOnBlockage);
    }, null, true, 'Europe/Vienna');
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

isRouteBlocked(reactOnBlockage); // test
//init();

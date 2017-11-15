"use strict";

const http = require("http");
const CronJob = require('cron').CronJob;
const evaluateTunnel = require('./scannor.js');

const PORT = 8081;

// long running server
http.createServer(function (request, response) {

    response.writeHead(200, {'Content-Type': 'text/plain'});
    // Send the response body as "Hello World"
    response.end('Hello World\n');
}).listen(PORT);

//  monday, turesday, wednesday and friday every second between 05:00 and 08:00
new CronJob('00 * 5-8 * * 1-3,5', function() {
    isTunnelClosed(reactOnClosedTunnel);
}, null, true, 'Europe/Vienna');

// bool parameter
function reactOnClosedTunnel(tunnelPassable) {
// TODO maybe https://developer-blog.net/raspberry-pi-sprachausgabe/
}

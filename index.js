const http = require("http");
const CronJob = require('cron').CronJob;
const isTunnelClosed = require('scannor.js');

const PORT = 8081;

http.createServer(function (request, response) {

    response.writeHead(200, {'Content-Type': 'text/plain'});
    // Send the response body as "Hello World"
    response.end('Hello World\n');
}).listen(PORT);

// Console will print the message
console.log(`Server running at http://127.0.0.1:{PORT}/`);


//  monday, turesday, wednesday and friday every second between 05:00 and 08:00
new CronJob('00 * 5-8 * * 1-3,5', function() {
    if(isTunnelClosed()) {
            // TODO maybe https://developer-blog.net/raspberry-pi-sprachausgabe/
    }
}, null, true, 'Europe/Vienna');

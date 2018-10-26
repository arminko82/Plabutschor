"use strict";

const Tools = require('./tools.js');
const https = require('http');

// Sends sms messages to a given list of recipients.
class SmsSender {
    constructor() {
        this.IP = "192.168.1.9";
        const ERROR_MSG = "No SMS numbers found.";
        try {
            const r = /((\+\d\d)\s?|0)\d{3}\s?\d+/g;
            const validNumbers =
                Tools.readLines("data/smsNumbers.txt").filter(l => r.test(l));
            this.mNumberLine = validNumbers.join();
            if(!this.mNumbers)
                Tools.log(ERROR_MSG);
        }
        catch(e) {
            Tools.log(ERROR_MSG);
        }
    }
    static toUrl (t, ns) => `http://${this.IP}/broadcast?text=${text}&numbers=${ns}`;

    static broadcast(smsText) {
        if(!this.mNumbers) {
            return false;
        }
        http.get(toUrl(smsText, this.mNumbers), resp => { FINISH THIS
          let data = '';
          resp.on('data', (chunk) => data += chunk);
          resp.on('end', () => {
            console.log(JSON.parse(data).explanation);
          });

        }).on("error", (err) => {
          console.log("Error: " + err.message);
        });
    }
}

if(typeof module !== 'undefined') {
    module.exports = SmsSender;
}

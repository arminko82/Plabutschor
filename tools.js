"use strict";

const moment = require('moment');
const fs = require('fs');

var sendmail;
try {
    sendMail = require('sendmail')();
}
catch(ignored) {}

const LOG_TRACE = true;

const MAIL_LIST = fs
    .readFileSync('./mail.list', {encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(l => l.indexOf('//') !== 0 && l.length > 0);

class Tools {
    static log(msg) {
        let time = new moment(new Date()).format('L LTS')
        console.log(`[${time}] ${msg}`);
    }

    static trace(msg) {
        if(LOG_TRACE)
            Tools.log(msg);
    }

    /**
     * Mail is sent to all recipients of file 'mail.list'
     */
    static sendMail(text) {
        try {
            if(sendmail === undefined) {
                Tools.log('Not sending email: ' + text);
                return;
            }
            for(var recipient of MAIL_LIST) {
                Tools.log('Sending notification to ' + recipient);
                sendmail({
                    from: 'no-reply@plabutschor.org',
                    to: recipient,
                    subject: 'Plabutschor Notification',
                    html: text,
                  }, function(err, reply) {
                    if(err)
                        Tools.log('Error on sending email: ' + err);
                });
            }
        }
        catch(ex) {
            Tools.log('Error on sending mail: ' + ex);
        }
    }
}

if(typeof module !== 'undefined') {
    module.exports = Tools;
}

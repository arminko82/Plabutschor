"use strict";

const moment = require('moment');
const fs = require('fs');
const sendmail = require('sendmail')();

const MAIL_LIST = fs
    .readFileSync('./mail.list', {encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(l => l.indexOf('//') !== 0 && l.length > 0);
console.log(MAIL_LIST);
class Tools {
    static log(msg) {
        let time = new moment(new Date()).format('L LTS')
        console.log(`[${time}] ${msg}`);
    }

    /**
     * Mail is sent to all recipients of file 'mail.list'
     */
    static sendMail(text) {
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
}

if(typeof module !== 'undefined') {
    module.exports = Tools;
}

"use strict";

const moment = require('moment');
const fs = require('fs');

var sendmail;
try {
    sendMail = require('sendmail')();
}
catch(ignored) {}

const LOG_TRACE = false;

const MAIL_LIST = fs
.readFileSync('./data/mail.list', {encoding: 'utf8' })
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

    static initPolyfill() {
        if (!Array.prototype.includes) {
            Array.prototype.includes = function(searchElement /*, fromIndex*/) {
                if (this == null) {
                    throw new TypeError('Array.prototype.includes called on null or undefined');
                }

                var O = Object(this);
                var len = parseInt(O.length, 10) || 0;
                if (len === 0) {
                    return false;
                }
                var n = parseInt(arguments[1], 10) || 0;
                var k;
                if (n >= 0) {
                    k = n;
                } else {
                    k = len + n;
                    if (k < 0) {k = 0;}
                }
                var currentElement;
                while (k < len) {
                    currentElement = O[k];
                    if (searchElement === currentElement ||
                        (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
                            return true;
                        }
                        k++;
                    }
                    return false;
                };
            }
        }
        static lt(moment1, moment2) { return moment1 < moment2; }
        static gt(moment1, moment2) { return moment1 > moment2;}
        static eq(moment1, moment2) { return moment1.isSame(moment2) === true;}
        static correctDay(day, days) { return days.includes(day) === true;}
        static correctRange(now, days, range) {
            return Tools.correctDay(now.weekday(), days) === true &&
                   Tools.gt(now, range[0]) === true &&
                   Tools.lt(now, range[1]) === true;
        }
    }

    if(typeof module !== 'undefined') {
        module.exports = Tools;
    }

"use strict";

const moment = require('moment');

class Tools {
    static log(msg) {
        let time = new moment(new Date()).format('L LTS')
        console.log(`[${time}] ${msg}`);
    }
}

if(typeof module !== 'undefined') {
    module.exports = Tools;
}

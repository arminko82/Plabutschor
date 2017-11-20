"use strict";
/*
* Saves all read traffic information to a user data folder
*/

const path = require('path');
const fs = require('fs');
const Tools = require('./tools.js');

var DIR = '';

function init() {
    const base = process.env.APPDATA || process.env.HOME;
    const dir = path.join(base, 'plabutschor');
    Tools.log("Archive: " + dir);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    DIR = dir;
}

function store(data) {
    var file = path.join(DIR, String(new Date().getTime()) + '.js');
    fs.writeFile(file, data);
    Tools.log("Wrote: " + file);
}

init();

if(typeof module !== 'undefined') {
    module.exports = store;
}

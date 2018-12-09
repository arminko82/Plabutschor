"use strict";
/*
* Saves all read traffic information to a user data folder
*/

const path = require("path");
const fs = require("fs");
const Tools = require("./tools.js");

var DIR = "";
var initSucessful = false;

function init() {
	try {
		const base = process.env.APPDATA || process.env.HOME;
		const dir = path.join(base, "plabutschor");
		Tools.log("Archive: " + dir);
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
		DIR = dir;
		initSucessful = true;
	}
	catch(ex) {
		Tools.log("Error on archive.init: " + ex);
	}
}

function clear() {
	if(!initSucessful)
		return;
	fs.readdir(DIR, (err, files) => {
		if (err)
			throw err;
		for (const file of files) {
			fs.unlink(path.join(DIR, file), err => {
				if (err)
					throw err;
			});
		}
	});
}

function store(data) {
	if(!initSucessful)
		return;
	var file = path.join(DIR, String(new Date().getTime()) + ".json");
	fs.writeFile(file, data);
	Tools.log("Wrote: " + file);
}

init();

if(typeof module !== "undefined") {
	module.exports =  {
		store,
		clear
	};
}

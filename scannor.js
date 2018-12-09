"use strict";

const Tools = require("./tools.js");
const archive = require("./archive.js");
const scannor = require("./scannor-oe3.js");

const DO_ARCHIVE = true;

function accountPotentialBlockage(reactor) {
	fetchTraffic(decider, reactor);

	function decider(data) {
		if(!data) {
			Tools.log("Could not fetch data.");
			return false; // end handling
		}
		const traffic = scannor.fetch(data);
		for(const test of [ scannor.isTunnelBlocked, scannor.isExpresswayBlocked ]) {
			const report = test(traffic);
			if(report) {
				reactor(report);
				return true; // done on first encounter and signal handled
			}
		}
		return false;
	}
}

function fetchTraffic(decider) {
	scannor.loader.get(scannor.SOURCE, resp => {
		let data = "";
		resp.on("data", (chunk) => data += chunk);
		resp.on("end", () =>  {
			var incidentFound = decider(data);
			if(DO_ARCHIVE && incidentFound) {
				archive.store(data);
			}
		});
	}).on("error", () => decider(null));
}

if(typeof module !== "undefined") {
	module.exports = accountPotentialBlockage;
}

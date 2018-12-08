const http = require("http");
const Tools = require("./tools.js");

const SOURCE = "http://oe3meta.orf.at/ApiV2.php/TrafficInfo.json";
const TUNNEL = "Plabutsch";
const BLOCKAGE_CODES = [5, 9];
const DESC_ID = "Text";
const ROUTE_ID ="Street";
const TYPE_ID = "EventCode";

function fetch(data) {
	return JSON.parse(data)["TrafficItems"];
}

/**
 * If some incident in the tunnel is assumed the indicent description is returned.
 * @param {Array<JSON>} traffic A number of traffic entries.
 * @returns null on nothing, else incident description.
 */
function isTunnelBlocked(traffic) {
	if(traffic == null) {
		Tools.log("Could not fetch traffic data.");
		return null;
	}
	const ID = "A9";
	var incident = traffic.find(
		n => n[ROUTE_ID] === ID &&
        BLOCKAGE_CODES.includes(n[TYPE_ID]) &&
        n[DESC_ID].indexOf(TUNNEL) !== -1);
	return incident === undefined ? null : incident[DESC_ID];
}

/**
 * If some incident in the S35 is assumed the indicent description is returned.
 * @param {Array<JSON>} traffic A number of traffic entries.
 * @returns null on nothing, else incident description.
 */
function isExpresswayBlocked(traffic) {
	const ID = "S35";
	var incident = traffic.find(
		n => n[ROUTE_ID] === ID && BLOCKAGE_CODES.includes(n[TYPE_ID]));
	return incident === undefined ? null : incident[DESC_ID];
}

if(typeof module !== "undefined") {
	module.exports = {
		loader: http,
		SOURCE,
		fetch,
		isTunnelBlocked,
		isExpresswayBlocked
	};
}

const https = require("https");
const moment = require("moment");
const Tools = require("./tools.js");

const SOURCE = "https://www.oeamtc.at/verkehrsservice/proxy.php?url=current/?count=9999&include=cameras";
const TUNNEL = "Plabutsch";
const BLOCKAGE = "Sperre";
const DESC_ID = "oeamtc.long-description";
const TIME_ID = "oeamtc.start-time";
const ROUTE_ID ="oeamtc.routeId";
const TYPE_ID = "oeamtc.type";

function fetch(data) {
	return JSON.parse(data)["contents"]["oeamtc.traffic-searchresult"]["oeamtc.list"]["oeamtc.traffic"];
}

function isTunnelBlocked(traffic) {
	if(traffic == null) {
		Tools.log("Could not fetch traffic data.");
		return null;
	}
	const ID = "A9";
	var incident = traffic.find(
		n => n[ROUTE_ID] === ID && n[TYPE_ID] === BLOCKAGE &&
        n[DESC_ID].indexOf(TUNNEL) !== -1 && isToday(n));
	return incident === undefined ? null : incident[DESC_ID];
}

function isExpresswayBlocked(traffic) {
	const ID = "S35";
	var incident = traffic.find(
		n => n[ROUTE_ID] === ID && n [TYPE_ID] === BLOCKAGE &&
        isToday(n));
	return incident === undefined ? null : incident[DESC_ID];
}

function isToday (n) {
    const time = n[TIME_ID];
    const now = moment();
    const result = moment(time).isSame(now, "day");
    return result;
}

if(typeof module !== "undefined") {
	module.exports = {
		loader: https,
		SOURCE,
		fetch,
		isTunnelBlocked,
		isExpresswayBlocked
	};
}

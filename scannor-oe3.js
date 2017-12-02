const http = require("http");

const SOURCE = "http://oe3meta.orf.at/ApiV2.php/TrafficInfo.json";
const TUNNEL = "Plabutsch";
const BLOCKAGE_CODE = 5;
const DESC_ID = 'Text';
const ROUTE_ID ='Street';
const TYPE_ID = 'EventCode';

function fetch(data) {
    return JSON.parse(data)['TrafficItems'];
}

function isTunnelBlocked(traffic) {
    const ID = 'A9';
    var incident = traffic.find(
        n => n[ROUTE_ID] === ID && n[TYPE_ID] === BLOCKAGE_CODE &&
        n[DESC_ID].indexOf(TUNNEL) !== -1);
    return incident === undefined ? null : incident[DESC_ID];
}

function isExpresswayBlocked(traffic) {
    const ID = 'S35';
    traffic.forEach(t => console.log(t[ROUTE_ID]));
    var incident = traffic.find(
        n => n[ROUTE_ID] === ID && n [TYPE_ID] === BLOCKAGE_CODE);
    return incident === undefined ? null : incident[DESC_ID];
}

if(typeof module !== 'undefined') {
    module.exports = {
        loader: http,
        SOURCE,
        fetch,
        isTunnelBlocked,
        isExpresswayBlocked
    };
}

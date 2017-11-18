"use strict";

const https = require('https');

const SOURCE = "https://www.oeamtc.at/verkehrsservice/proxy.php?url=current/";
const TUNNEL = "Plabutsch";
const indexText = 4;
const indexSymbol = 1;

var $ = {};

function fetch(done, reactor) {
    https.get(SOURCE, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        reactor(done(data));
      });
    }).on("error", (err) => {
      reactor(done(null))
    });
}

function isTunnelClosed(reactor) {
    fetch(isTunnelClosedDecider, reactor);
}

function isTunnelClosedDecider(data) {
    //console.log(data);
    var c = data.indexOf(TUNNEL) !== -1;
    // TODO: decide properly! do this by checking oeamtc.type against Sperre or Stau !!!
    return c;
    /*
    var qra = $("td.col" + indexText).toArray();
    var result = qra.find(announcementFilter);
    if(result) {
        var symbol = result.previousSibling.previousSibling.previousSibling.innerHTML.toString();
        var passable = symbol.contains('gesperrt');
        return passable;
    }
    return true; // wo know nothing => no reation
    */
}

if(typeof module !== 'undefined') {
    module.exports = isTunnelClosed;
}

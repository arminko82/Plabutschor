"use strict";

const https = require('https');
const jsdom = require('jsdom');
var $ = require('jQuery');

const SOURCE = "https://www.oeamtc.at/verkehrsservice/";
const TUNNEL = "Plabutsch";
const indexText = 4;
const indexSymbol = 1;

String.prototype.contains = (text, term) => text.indexOf(term) !== -1;
const announcementFilter = (n) => contains(n, TUNNEL);
const checkTunnel (reactor) =>  fetchDataSource(evaluteTunnel, reactor);
}

function fetchDataSource(evaluator, reactor) {
    jsdom.env({
        url: SOURCE,
        src: [jquery],
        done: function (errors, window) {
            reactor(evaluator());
        });
    });
}

    function evaluteTunnel() {
        var qra = $(".col" + indexText).toArray();
        var result = qra.find(announcementFilter);
        if(result) {
            var symbol = result.previousSibling.previousSibling.previousSibling.innerHTML.toString();
            var passable = symbol.contains('gesperrt');
            return passable;
        }
        return true; // wo know nothing => no reation
    }

    if(typeof module !== 'undefined') {
        module.exports = checkTunnel;
    }

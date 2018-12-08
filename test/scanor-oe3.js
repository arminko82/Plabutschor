    "use strict";

    const {expect} = require("chai");
    const _ = require("lodash");
    const fs = require('fs');
    const Scannor = require('../scannor-oe3.js');

    //test login
    describe('oe3 trafic information should be interpetable', function() {  
        it('should interpret a correct json based input', () => {
            const goodFile = ["stuff/test3.json", [5, 9], [11, 3]];
            const entries = file2json(goodFile[0]);
            expect(entries.length).to.be.greaterThan(0);
            const cs = getCodeCounts(entries);
            const counts = goodFile[1].map(i => cs[i]);
            const diff = _.difference(goodFile[2], counts);
            expect(_.isEmpty(diff)).to.be.true;
        });

        it('should interpret a correct json based input with no relevant alerts', () => {
            const badFile = ["stuff/test3-no-relevant.json", [5, 9], []];
            const entries = file2json(badFile[0]);
            expect(entries.length).to.be.greaterThan(0);
            const cs = getCodeCounts(entries);
            const counts = badFile[1].map(i => cs[i]);
            const diff = _.difference(badFile[2], counts);
            expect(_.isEmpty(diff)).to.be.true;
        });

        it('should interpret a NEW json based input', () => {
            const goodFile = ["stuff/test4.json", [5, 9], [12, 2]];
            const entries = file2json(goodFile[0]);
            expect(entries.length).to.be.greaterThan(0);
            const cs = getCodeCounts(entries);
            const counts = goodFile[1].map(i => cs[i]);
            const diff = _.difference(goodFile[2], counts);
            expect(_.isEmpty(diff)).to.be.true;
        });
/*
        if(data === null) {
            Assert
            Tools.log("Could not fetch data.");
            return false; // end handling
        }
        let traffic = scannor.fetch(data);
        for(let test of [ scannor.isTunnelBlocked, scannor.isExpresswayBlocked ]) {
            let report = test(traffic);
            if(report !== null) {
                reactor(report);
                return true; // done on first encounter and signal handled
            }
        }
        */

        /**
         * Takes all the event codes and counts them.
         * @param {Array<JSON>} messages Array of messages.
         * @returns Object of key (event code) value (count) relations.
         */
        function getCodeCounts(messages) {
            const cs = {};
            messages
                .map(e => e.EventCode)
                .forEach(c => cs[c] = 1 + (isNaN(cs[c]) ? 0 : cs[c]));
            return cs;
        }
        /**
         * Reads the input from file and creates a JSON object from it.
         * Does not handle errors as this is the job of callers here.
         * @param {string} inputFile Test input file.
         * @returns A json array of the file's content.
         */
        function file2json(inputFile) {
            const content = fs.readFileSync(inputFile, 'utf8');
            const data = Scannor.fetch(content);
            return data;    
        }
    });
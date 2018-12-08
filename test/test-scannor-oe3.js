"use strict";
/* eslint-disable no-undef */

const {expect} = require("chai");
const _ = require("lodash");
const fs = require("fs");
const scannor = require("../scannor-oe3.js");

describe("oe3 trafic information should be interpetable", function() {  
	it("should interpret a correct json based input", () => {
		const goodFile = ["stuff/test3.json", [5, 9], [11, 3]];
		const entries = file2json(goodFile[0]);
		expect(entries.length).to.be.greaterThan(0);
		const cs = getCodeCounts(entries);
		const counts = goodFile[1].map(i => cs[i]);
		const diff = _.difference(goodFile[2], counts);
		expect(_.isEmpty(diff)).to.be.true;
	});

	it("should interpret a correct json based input with no relevant alerts", () => {
		const badFile = ["stuff/test3-no-relevant.json", [5, 9], []];
		const entries = file2json(badFile[0]);
		expect(entries.length).to.be.greaterThan(0);
		const cs = getCodeCounts(entries);
		const counts = badFile[1].map(i => cs[i]);
		const diff = _.difference(badFile[2], counts);
		expect(_.isEmpty(diff)).to.be.true;
	});

	it("should interpret a NEW json based input", () => {
		const goodFile = ["stuff/test4.json", [5, 9], [12, 2]];
		const entries = file2json(goodFile[0]);
		expect(entries.length).to.be.greaterThan(0);
		const cs = getCodeCounts(entries);
		const counts = goodFile[1].map(i => cs[i]);
		const diff = _.difference(goodFile[2], counts);
		expect(_.isEmpty(diff)).to.be.true;
	});

	it("should test against tunnel blockage of code 5", () => {
		const entries = file2json("stuff/test3.json");
		const expected = "A9 Pyhrnautobahn: St. Michael Richtung Graz Plabutschtunnel gesperrt";
		expect(scannor.isTunnelBlocked(entries)).to.equal(expected);
		expect(scannor.isExpresswayBlocked(entries)).to.be.null;
	});

	it("should test against a motorway blockage of code 9", () => {
		const entries = file2json("stuff/test2.json");
		const expected = "S35 Brucker Schnellstraße: Badl durch Felssturz nicht erreichbar.";
		expect(scannor.isTunnelBlocked(entries)).to.be.null;
		expect(scannor.isExpresswayBlocked(entries)).to.equal(expected);
	});

	it("should interpret fail gracefully on empty relevant data", () => {
		const goodFile = ["stuff/test4.json", [5, 9], [12, 2]];
		const entries = file2json(goodFile[0]);
		expect(entries.length).to.be.greaterThan(0);
		const cs = getCodeCounts(entries);
		const counts = goodFile[1].map(i => cs[i]);
		const diff = _.difference(goodFile[2], counts);
		expect(_.isEmpty(diff)).to.be.true;
	});

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
		const content = fs.readFileSync(inputFile, "utf8");
		const data = scannor.fetch(content);
		return data;    
	}
});
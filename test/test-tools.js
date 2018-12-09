"use strict";
/* eslint-disable no-undef */

const {expect} = require("chai");
const Tools = require("../tools.js");

describe("Tools should do what they are being expetced to do.", function() {  
	it("reading text files from relative path should work", () => {
		const file = "stuff/test4.json";
		const lines = Tools.readLines(file);
		expect(lines).to.not.be.null;
		expect(lines.length).to.equal(418);
	});
});
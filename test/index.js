'use strict';

var _ = require('underscore');
var Assert = require('assert');
// var Mocha = require('mocha');
// var describe = Mocha.describe;
// var it = Mocha.it;

var Clean = require('..');


describe('nameParse()', function() {

	function check(name, prefix, base, suffix) {

		var got = Clean.nameParse(name);
		var expected = {
			original: name,
			prefix: prefix,
			suffix: suffix,
			base: base
		};

		Assert.ok(_.isObject(got), '`got` should be an object');
		Assert.equal(got.original, expected.original);
		Assert.equal(got.prefix, expected.prefix);
		Assert.equal(got.suffix, expected.suffix);
		Assert.equal(got.base, expected.base);
	}

	it('should find multiple prefixes and suffixes', function() {
		check('REV Dr. Matthew Mark Luke John jr. M.D.', 'REV Dr.', 'Matthew Mark Luke John', 'jr. M.D.');
	});

	it('should find a suffix which is denoted by a hyphen instead of a space', function() {
		check('Dr Bob Kelso-M.D.', 'Dr', 'Bob Kelso', 'M.D.');
	});

	it('should find a suffix which is denoted by a comma instead of a space', function() {
		check('Doctor Perry Cox,PhD', 'Doctor', 'Perry Cox', 'PhD');
	});

	it('should find suffixes only at the end of the name', function() {
		check('J.D. Turk RN', '', 'J.D. Turk', 'RN');
	});

	it('should remove trailing non-letters', function() {
		check('J.D. Turk RN .', '', 'J.D. Turk', 'RN');
	});

	it('should return a name base, even if it looks like a prefix', function() {
		check('Dr.', '', 'Dr.', '');
	});

	it('should return a name base, even if it looks like a suffix', function() {
		check('J.D.', '', 'J.D.', '');
	});

	it('should not confuse words which look similar to regex', function() {
		check('J.D. JaDe', '', 'J.D. JaDe', '');
	});

	it('should remove invalid characters at the front of the name', function() {
		check('-Dr Professor Farnsworth - Ph.D.', 'Dr Professor', 'Farnsworth', 'Ph.D.');
	});

	// it('should find return a maiden name as a suffix', function() {
	// 	check('Jane Smith - Carpenter', '', 'Jane Smith', 'Carpenter');
	// });
});

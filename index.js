'use strict';

var _ = require('underscore');
var Assert = require('assert');
var Clean = require('underscore.string/clean');
var Moment = require('moment');
var Phone = require('@esscorp/gphone');


exports.trim = Clean;

exports.licet = function(str) {
	return Clean(str);
};

exports.date = function(date) {
	return date;
};

exports.phone = function(str) {
	return Phone.format(str, 'E164');
};

exports.license = function(str) {
	return Clean(str);
};

exports.email = function(email) {
	if (!email) return;
	return email.trim();
};

exports.name = function(name) {
	if (!name) return;
	var cleanedSpaces = Clean(name);
	var cleanedSides = exports._trimNonAlphaFromSides(cleanedSpaces);
	return cleanedSides;
};

// todo: should the string lengths be similar? e.g., should 'de la rose hernandez' match 'hernandez'?
// One limitation of this fnc is that the shorter the str
// the more likely it will be matched against another string.
// For example, name_first = "Ki" and name_last =  "O" could
// match many other names of different persons.  Therefore,
// consider not doing a bi-directional match with names shorter
// than x charaters. This becomes important because we have
// cases where one administrative personnel will register using
// their own email address and register many hundreds of staff
// members using an administrative email address.
exports.matches = function(str1, str2) {

	Assert.ok(_.isString(str1), 'Param `str1` must be string.');
	Assert.ok(_.isString(str2), 'Param `str2` must be string.');

	str1 = str1.toUpperCase();
	str2 = str2.toUpperCase();

	if (str1.length < 5 || str2.length < 5) return exports._equals(str1, str2);

	var escaped1 = exports._escapeRegex(str1);
	var escaped2 = exports._escapeRegex(str2);

	var found = new RegExp(escaped1).test(str2);
	if (!found) found = new RegExp(escaped2).test(str1);

	return found;
};

exports.nameBase = function(name) {

	Assert.ok(_.isString(name) || _.isNull(name), 'Param `name` must be string or null');

	if (!name) return null;

	var parsed = exports.nameParse(name);

	return parsed.base;
};

exports.nameParse = function(name) {

	Assert.ok(_.isString(name) || _.isNull(name), 'Param `name` must be string or null');

	var parsed = {
		original: name,
		prefix: '',
		suffix: '',
		base: ''
	};

	if (!name) return parsed;

	var cleaned = exports._trimNonAlphaFromSides(name);
	var words = exports._splitName(cleaned);

	var isOneWord = (words.length < 2);
	if (isOneWord) {
		//return early
		parsed.base = _.first(words);
		return parsed;
	}

	var prefixes = [];
	var suffixes = [];
	var bases = [];

	words.forEach(function(word) {

		var foundBase = bases.length;

		if (!foundBase && exports._isPrefix(word)) {
			prefixes.push(word);

		} else if (foundBase && exports._isSuffix(word)) {
			suffixes.push(word);

		} else {
			// If we found any suffixes before reaching the end,
			// assume they were false positives.
			if (suffixes.length) {
				bases = suffixes;
				suffixes = [];
			}

			bases.push(word);
		}
	});

	parsed.prefix = prefixes.join(' ');
	parsed.suffix = suffixes.join(' ');
	parsed.base = bases.join(' ');

	return parsed;
};

exports.isSameDate = function(date1, date2) {
	if (_.isNull(date1) && _.isNull(date2)) return true; //Moment would return false

	var isSameYearMonthDay = Moment(date1).isSame(date2, 'day');
	return isSameYearMonthDay;
};

exports._equals = function(str1, str2) {

	var letters1 = exports._removeNonAlpha(str1);
	var letters2 = exports._removeNonAlpha(str2);

	return (letters1 === letters2);
};

exports._trimNonAlphaFromSides = function(str) {
	var reInvalidBegWords = /^[^A-Za-z]*([A-Za-z].*)/; // " . -Dr." to "Dr."
	var reInvalidEndWords = /([A-Za-z].*?)\s[^A-Za-z]*$/; // "M.D . " to "M.D"
	return str.replace(reInvalidBegWords, '$1').replace(reInvalidEndWords, '$1');
};

exports._splitName = function(name) {
	var spliter = /[\s-,]+/;
	return name.split(spliter); // "Dr. Bob Kelso,Jr.-M.D." to ["Dr.", "Bob", "Kelso", "Jr.", "M.D."]
};

exports._escapeRegex = function(str) {
	return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'); // "(Bob)" to "\(Bob\)"
};

//todo: edit these. Remove unneeded and add additional needed.
exports._prefixes = [
	'AIRMAN', 'ATTORNEY', 'ATTY', 'BG', 'BR',
	'BRIG', 'BRIGADIER', 'CADET', 'CAPT', 'CAPTAIN',
	'CMDR', 'COL', 'COLONEL', 'COMMANDER', 'COMMISSIONER',
	'CORPORAL', 'CPL', 'CPT', 'DEP', 'DEPUTY',
	'DOCTOR', 'DR', 'FATHER', 'FR', 'GEN',
	'GENERAL', 'GOV', 'GOVERNOR', 'HON', 'HONORABLE',
	'JDGE', 'JUDGE', 'LIEUTENANT', 'LT', 'LTCOL',
	'LTGEN', 'MAJ', 'MAJGEN', 'MAJOR', 'MASTER',
	'MISS', 'MISTER', 'MONSIGNOR', 'MR', 'MRMRS',
	'MRS', 'MS', 'MSGR', 'PASTOR', 'PFC',
	'PRES', 'PRESIDENT', 'PRIVATE', 'PROF', 'PROFESSOR',
	'PVT', 'RABBI', 'REP', 'REPRESENTATIVE', 'REV',
	'REVEREND', 'SEN', 'SENATOR', 'SGT', 'SHERIFF',
	'SIR', 'SISTER', 'SM', 'SN', 'SRA',
	'SSGT', 'SUPERINTENDENT', 'SUPT'
];

//todo: edit these. Remove unneeded and add additional needed.
exports._suffixes = [
	'APR', 'BC', 'BSN', 'CCSP', 'CDT',
	'CME', 'CNP', 'CPA', 'DC', 'DDS',
	'DMA ', 'DMD', 'DMIN', 'DMUS', 'DNP',
	'DO', 'DPM', 'DVM', 'EDD', 'EI',
	'EIT', 'ESQ', 'FNP', 'GVN', 'I',
	'II', 'III', 'IV', 'JD', 'JR',
	'LCSW', 'LLS', 'LP', 'LPC', 'LPN',
	'LUTCF', 'LVN', 'MA', 'MBA', 'MD',
	'MED', 'OC', 'OD', 'PA', 'PE',
	'PHARMD', 'PHD', 'PSYD', 'RA', 'RD',
	'RDH', 'RLA', 'RLS', 'RN', 'RNBC',
	'SE', 'SJ', 'SR', 'V', 'VI',
	'VII', 'VIII', 'VP'
];

exports._isPrefix = function(word) {
	return exports._containsLoose(exports._prefixes, word);
};

exports._isSuffix = function(word) {
	// todo: perhaps in the future cache the lic.licets in memory
	// and add the service/client specific licets to the suffix
	// testing.
	return exports._containsLoose(exports._suffixes, word);
};

exports._containsLoose = function(collection, word) {
	var wordClean = exports._removeNonAlpha(word).toUpperCase();
	return _.contains(collection, wordClean);
};

exports._removeNonAlpha = function(str) {
	var reNonAlpha = /[^A-Za-z]/g;
	return str.replace(reNonAlpha, ''); // "M.D." to "MD"
};

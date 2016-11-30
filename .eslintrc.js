// for `linter-eslint` Atom package, not grunt
'use strict';

var Config = require('eslint-config-ess').configs.backend;

delete Config.rules['lowercase-require']; // ok because grunt does not run this file


module.exports = Config;

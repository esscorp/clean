'use strict';

var Pkg = require('./package.json');


module.exports = function(grunt) {

	// Initialize config.
	grunt.initConfig({
		pkg: Pkg
	});

	// Load per-task config from separate files.
	grunt.loadTasks('grunts');


	grunt.registerTask('check', [
		'eslint'
	]);

	grunt.registerTask('lint', [
		'eslint'
	]);

	grunt.registerTask('stats', [
		'sloc:ours',
		'sloc:all'
	]);

	grunt.registerTask('default', [
		'check'
	]);
};

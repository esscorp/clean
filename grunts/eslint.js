'use strict';


module.exports = function(grunt) {

	grunt.config('eslint', {
		options: {
			rulePaths: ['node_modules/eslint-config-ess/rules']
		},
		backend: {
			options: {
				config: 'eslint-config-ess/configs/backend.js'
			},
			src: [
				'*.js',
				'grunts/**/*.js'
			]
		}
	});

	grunt.loadNpmTasks('grunt-eslint');
};

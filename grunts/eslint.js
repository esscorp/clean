'use strict';


module.exports = function(grunt) {

	grunt.config('eslint', {
		options: {
			rulePaths: ['node_modules/@esscorp/eslint/rules']
		},
		backend: {
			options: {
				config: 'node_modules/@esscorp/eslint/configs/backend.js'
			},
			nonull: true,
			src: [
				'*.js',
				'grunts/**/*.js'
			]
		}
	});

	grunt.loadNpmTasks('grunt-eslint');
};

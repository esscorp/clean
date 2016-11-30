'use strict';


module.exports = function(grunt) {

	grunt.config('sloc', {
		options: {
			reportType: 'stdout',
			reportDetail: true

		},
		'all': {
			files: {
				'.': ['**/*.*']
			}
		},
		'ours': {
			files: {
				'.': ['*.*'],
				'./grunts': ['**.*']
			}
		}
	});

	grunt.loadNpmTasks('grunt-sloc');
};

'use strict';


module.exports = function(grunt) {

	grunt.config('sloc', {
		options: {
			reportType: 'stdout',
			reportDetail: true
			// tolerant: true
		},
		'all': {
			files: {
				'.': ['**']
			}
		},
		'ours': {
			files: {
				'.': [
					'**',
					'!**/node_modules/**'
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-sloc');
};

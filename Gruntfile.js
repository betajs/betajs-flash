module.banner = '/*!\n<%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\nCopyright (c) <%= pkg.contributors %>\n<%= pkg.license %> Software License.\n*/\n';

module.exports = function(grunt) {
	
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		'revision-count': {
		    options: {
		      property: 'revisioncount',
		      ref: 'HEAD'
		    }
		},
		concat : {
			options : {
				banner : module.banner
			},
			dist_raw : {
				dest : 'dist/betajs-flash-raw.js',
				src : [
					'src/fragments/begin.js-fragment',
				    'src/js/*.js',
					'src/fragments/end.js-fragment'
				]
			},
			dist_scoped: {
				dest : 'dist/betajs-flash.js',
				src : [
				    'vendors/scoped.js',
				    'dist/betajs-flash-noscoped.js'
				]
			}
		},
		preprocess : {
			options: {
			    context : {
			    	MAJOR_VERSION: '<%= revisioncount %>',
			    	MINOR_VERSION: (new Date()).getTime()
			    }
			},
			dist : {
			    src : 'dist/betajs-flash-raw.js',
			    dest : 'dist/betajs-flash-noscoped.js'
			}
		},	
		clean: {
			raw: "dist/betajs-flash-raw.js",
			closure: "dist/betajs-flash-closure.js",
			browserstack : [ "./browserstack.json", "BrowserStackLocal" ],
			jsdoc : ['./jsdoc.conf.json']
		},
		jsdoc : {
			dist : {
				src : [ './README.md', './src/*/*.js' ],					
				options : {
					destination : 'docs',
					template : "node_modules/grunt-betajs-docs-compile",
					configure : "./jsdoc.conf.json",
					tutorials: "./docsrc/tutorials",
					recurse: true
				}
			}
		},
		uglify : {
			options : {
				banner : module.banner
			},
			dist : {
				files : {
					'dist/betajs-flash-noscoped.min.js' : [ 'dist/betajs-flash-noscoped.js' ],					
					'dist/betajs-flash.min.js' : [ 'dist/betajs-flash.js' ]				
				}
			}
		},
		jshint : {
			options: {
				es5: false,
				es3: true
			},
			source : [ "./src/**/*.js"],
			dist : [ "./dist/betajs-flash-noscoped.js", "./dist/betajs-flash.js" ],
			gruntfile : [ "./Gruntfile.js" ],
			tests : [ "./tests/media/*.js" ]
		},
		shell: {
			flash: {
		    	command: 'mxmlc Main.as -static-link-runtime-shared-libraries -output ../../dist/betajs-flash.swf',
		    	options: {
                	stdout: true,
                	stderr: true,
                	execOptions: {
                    	cwd: 'src/flash'
                	}
            	},
            	src: [
            		"src/flash/*.as"
            	]
			},
			tests: {
				command: "open http://localhost:8080/tests/tests.html ; php -S localhost:8080"
			},
			browserstack : {
				command : 'browserstack-runner',
				options : {
					stdout : true,
					stderr : true
				}
			}
		},
		closureCompiler : {
			options : {
				compilerFile : process.env.CLOSURE_PATH + "/compiler.jar",
				compilerOpts : {
					compilation_level : 'ADVANCED_OPTIMIZATIONS',
					warning_level : 'verbose',
					externs : [ "./src/fragments/closure.js-fragment", "./vendors/jquery-1.9.closure-extern.js" ]
				}
			},
			dist : {
				src : ["./vendors/scoped.js", "./vendors/beta-noscoped.js", "./vendors/betajs-browser-noscoped.js", "./dist/betajs-flash-noscoped.js"],
				dest : "./dist/betajs-flash-closure.js"
			}
		},
		wget : {
			dependencies : {
				options : {
					overwrite : true
				},
				files : {
					"./vendors/scoped.js" : "https://raw.githubusercontent.com/betajs/betajs-scoped/master/dist/scoped.js",
					"./vendors/beta-noscoped.js" : "https://raw.githubusercontent.com/betajs/betajs/master/dist/beta-noscoped.js",
					"./vendors/betajs-browser-noscoped.js" : "https://raw.githubusercontent.com/betajs/betajs-browser/master/dist/betajs-browser-noscoped.js",
					"./vendors/jquery-1.9.closure-extern.js" : "https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/jquery-1.9.js"
				}
			}
		},
		template : {
			"readme" : {
				options : {
					data: {
						indent: "",
						framework: grunt.file.readJSON('package.json')
					}
				},
				files : {
					"README.md" : ["readme.tpl"]
				}
			},
			"jsdoc": {
				options: {
					data: {
						data: {
							"tags": {
								"allowUnknownTags": true
							},
							"plugins": ["plugins/markdown"],
							"templates": {
								"cleverLinks": false,
								"monospaceLinks": false,
								"dateFormat": "ddd MMM Do YYYY",
								"outputSourceFiles": true,
								"outputSourcePath": true,
								"systemName": "BetaJS",
								"footer": "",
								"copyright": "BetaJS (c) - MIT License",
								"navType": "vertical",
								"theme": "cerulean",
								"linenums": true,
								"collapseSymbols": false,
								"inverseNav": true,
								"highlightTutorialCode": true,
								"protocol": "fred://",
								"singleTutorials": true,
								"emptyTutorials": true
							},
							"markdown": {
								"parser": "gfm",
								"hardwrap": true
							}
						}
					}
				},
				files : {
					"jsdoc.conf.json": ["json.tpl"]
				}
			},
			"browserstack-desktop" : {
				options : {
					data: {
						data: {
							"test_path" : "tests/tests.html",
							"test_framework" : "qunit",
							"timeout": 10 * 60,
							"browsers": [
				              	'firefox_latest',
							    'firefox_4',
				                'chrome_latest',
					            'chrome_14', 
				                'safari_latest',
					            'safari_4',
				                'opera_latest', 
							    'opera_12_15',
				                'ie_11',
				                'ie_10',
				                'ie_9',
				                'ie_8',
				                'ie_7',
				                'ie_6'
				            ]
						}
					}
				},
				files : {
					"browserstack.json" : ["json.tpl"]
				}
			}			
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-git-revision-count');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-wget');
	grunt.loadNpmTasks('grunt-closure-tools');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-node-qunit');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-shell');	
	grunt.loadNpmTasks('grunt-template');

	grunt.registerTask('default', ['revision-count', 'concat:dist_raw', 'preprocess', 'clean:raw', 'concat:dist_scoped', 'uglify', 'shell:flash']);
	grunt.registerTask('qunit', [ 'shell:tests' ]);
	grunt.registerTask('docs', ['template:jsdoc', 'jsdoc', 'clean:jsdoc']);
	grunt.registerTask('lint', [ 'jshint:source', 'jshint:dist',
	                 			 'jshint:gruntfile', 'jshint:tests' ]);
	grunt.registerTask('check', ['lint', 'qunit']);
	grunt.registerTask('dependencies', [ 'wget:dependencies' ]);
	grunt.registerTask('closure', [ 'closureCompiler', 'clean:closure' ]);
	grunt.registerTask('browserstack-desktop', [ 'template:browserstack-desktop', 'shell:browserstack', 'clean:browserstack' ]);
	grunt.registerTask('readme', [ 'template:readme' ]);

};
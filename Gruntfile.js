module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');
	var gruntHelper = require('betajs-compile');
	var dist = 'betajs-flash';

	gruntHelper.init(pkg, grunt)
	
	
    /* Compilation */    
	.flashTask(null, 'src/flash/Main.as', 'dist/betajs-flash.swf')
	.scopedclosurerevisionTask(null, "src/**/*.js", "dist/" + dist + "-noscoped.js", {
		"module": "global:BetaJS.Flash",
		"base": "global:BetaJS",
		"browser": "global:BetaJS.Browser"
    }, {
    	"base:version": pkg.devDependencies.betajs,
    	"browser:version": pkg.devDependencies["betajs-browser"]
    })	
    .concatTask('concat-scoped', [require.resolve("betajs-scoped"), 'dist/' + dist + '-noscoped.js'], 'dist/' + dist + '.js')
    .uglifyTask('uglify-noscoped', 'dist/' + dist + '-noscoped.js', 'dist/' + dist + '-noscoped.min.js')
    .uglifyTask('uglify-scoped', 'dist/' + dist + '.js', 'dist/' + dist + '.min.js')
    .packageTask()

    /* Testing */
    .browserqunitTask(null, "tests/tests.html", true)
    .closureTask(null, [require.resolve("betajs-scoped"), require.resolve("betajs"), require.resolve("betajs-browser"), "./dist/betajs-flash-noscoped.js" ], null, { })
    .browserstackTask(null, 'tests/tests.html', {desktop: true, mobile: true, flash: true})
    .lintTask(null, ['./src/**/*.js', './dist/' + dist + '-noscoped.js', './dist/' + dist + '.js', './Gruntfile.js', './tests/**/*.js'])
    
    /* External Configurations */
    .codeclimateTask()
    
    /* Markdown Files */
	.readmeTask()
    .licenseTask()
    
    /* Documentation */
    .docsTask();

	grunt.initConfig(gruntHelper.config);	

	grunt.registerTask('default', ['package', 'readme', 'license', 'codeclimate', 'flash', 'scopedclosurerevision', 'concat-scoped', 'uglify-noscoped', 'uglify-scoped']);
	grunt.registerTask('check', ['lint', 'browserqunit']);

};
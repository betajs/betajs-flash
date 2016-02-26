module.exports = function(grunt) {

	var pkg = grunt.file.readJSON('package.json');
	var gruntHelper = require('betajs-compile/grunt.js');
	var dist = 'betajs-flash';

	gruntHelper.init(pkg, grunt)
	
	
    /* Compilation */    
	.flashTask(null, 'src/flash/Main.as', 'dist/betajs-flash.swf')
	.scopedclosurerevisionTask(null, "src/**/*.js", "dist/" + dist + "-noscoped.js", {
		"module": "global:BetaJS.Flash",
		"base": "global:BetaJS",
		"browser": "global:BetaJS.Browser",
		"jquery": "global:jQuery"
    }, {
    	"base:version": 444,
    	"browser:version": 58
    })	
    .concatTask('concat-scoped', ['vendors/scoped.js', 'dist/' + dist + '-noscoped.js'], 'dist/' + dist + '.js')
    .uglifyTask('uglify-noscoped', 'dist/' + dist + '-noscoped.js', 'dist/' + dist + '-noscoped.min.js')
    .uglifyTask('uglify-scoped', 'dist/' + dist + '.js', 'dist/' + dist + '.min.js')
    .packageTask()

    /* Testing */
    .browserqunitTask(null, "tests/tests.html", true)
    .closureTask(null, ["./vendors/scoped.js", "./vendors/beta-noscoped.js",  "./vendors/betajs-browser-noscoped.js", "./dist/betajs-flash-noscoped.js"], null, { jquery: true })
    .browserstackTask(null, 'tests/tests.html', {desktop: true, mobile: false})
    .browserstackTask(null, 'tests/tests.html', {desktop: false, mobile: true})
    .lintTask(null, ['./src/**/*.js', './dist/' + dist + '-noscoped.js', './dist/' + dist + '.js', './Gruntfile.js', './tests/**/*.js'])
    
    /* External Configurations */
    .codeclimateTask()
    
    /* Dependencies */
    .dependenciesTask(null, { github: [
        'betajs/betajs-scoped/dist/scoped.js',
        'betajs/betajs/dist/beta-noscoped.js',
        'betajs/betajs-browser/dist/betajs-browser-noscoped.js'
     ] })

    /* Markdown Files */
	.readmeTask()
    .licenseTask()
    
    /* Documentation */
    .docsTask();

	grunt.initConfig(gruntHelper.config);	

	grunt.registerTask('default', ['package', 'readme', 'license', 'codeclimate', 'flash', 'scopedclosurerevision', 'concat-scoped', 'uglify-noscoped', 'uglify-scoped']);
	grunt.registerTask('check', ['lint', 'browserqunit']);

};
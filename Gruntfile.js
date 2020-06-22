module.exports = function (grunt) {

  // GruntFile broken up to import partials from assets/grunt following guides at:
  // @link https://css-tricks.com/organizing-grunt-tasks/
  // @link https://css-tricks.com/lets-give-grunt-tasks-the-marie-kondo-organization-treatment/

  // Replaces grunt.loadNpmTasks to load grunt tasks from package.json
  require('load-grunt-tasks')(grunt);
  // TODO: Would like to use jit-grunt but it doesn't like the uglify-es module

  // Display timings of tasks
  require('time-grunt')(grunt);

  // Begin project config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), // Import package.json
    // Sets up global variables which will be used throughout the partials
    opts: {
      build_dir: 'assets',
      dist_dir: 'dist',
      banner:
      '/*! <%= pkg.name %> <%= pkg.version %>\n' +
      ' * © <%= grunt.template.today("yyyy-mm-dd") %> <%= pkg.author.name %> - <%= pkg.author.url %> */\n',
    }
  });

  // Loads all tasks from the specified folder.
  // This has to run after initConfig() or it will have nothing to work with
  grunt.loadTasks('assets/grunt');

  //console.log(grunt.config()); // Comment in to debug the config

  // Register tasks
  grunt.registerTask('default', [ 'browserSync', 'watch' ]);
  grunt.registerTask('build', [ 'newer:copy:npm', 'eslint', 'concat', 'uglify', 'sass_directory_import', 'sass', 'postcss', 'usebanner', 'clean', 'imagemin' ]);
  grunt.registerTask('init', [ 'build', 'default' ]);

};

// TODO: Add Grunt Bump?

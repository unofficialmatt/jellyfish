// Important to use `grunt` as an argument in the function
module.exports = function (grunt) {

  // Configure Copy task through config.merge as this task may be used across multiple partials
  // Copies required libraries from node_modules
  grunt.config.merge({
    copy: {
      npm: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/hamburgers/_sass/hamburgers',
            src: ['**/*'],
            dest: '<%= opts.build_dir %>/scss/jellyfish/05-vendor/hamburgers'
          }
        ],
      }
    }
  });

};

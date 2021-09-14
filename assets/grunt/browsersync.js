// Important to use `grunt` as an argument in the function
module.exports = function (grunt) {

  // Configure Browsersync task
  // browserSync watches files defined in src, and on change reloads the browser
  grunt.config('browserSync', {
    bsFiles: {
      src: [
        '<%= opts.dist_dir %>/css/jellyfish.min.css',
        '<%= opts.dist_dir %>/js/jellyfish.min.js',
        '**/*.html'
      ]
    },
    options: {
      watchTask: true,
      server: {
        baseDir: "./",
        https: true
      }
    }
  });

};

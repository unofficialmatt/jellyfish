// Important to use `grunt` as an argument in the function
module.exports = function (grunt) {

  // Configure Concat task
  // Task to concatenate js files together separated by a line break
  grunt.config('concat', {
    options: {
      sourceMap: false,
      separator: ';\r\n'
    },
    dist: {
      src: ['<%= opts.build_dir %>/js/**/*.js'],
      dest: '<%= opts.dist_dir %>/js/jellyfish.js',
    }
  });

  // Configure Uglify task
  // Minifies javascript file(s)
  grunt.config('uglify', {
    options: {
      mangle: false,
      banner: '<%= opts.banner %>'
    },
    dist: {
      files: {
        '<%= opts.dist_dir %>/js/jellyfish.min.js': ['<%= opts.dist_dir %>/js/jellyfish.js']
      }
    }
  });

  // Configure ESlint task through config.merge as this task is used across multiple partials
  // Validates Javascript files
  grunt.config.merge({
    eslint: {
      site: [
        '<%= opts.build_dir %>/js/**/*.js'
      ],
    }
  });

  // Configure Watch task through config.merge as this task is used across multiple partials
  // Watches javascript files for changes and then runs tasks accordingly
  grunt.config.merge({
    watch: {
      scripts: {
        options: {
          event: ['changed', 'added', 'deleted']
        },
        files: ['<%= opts.build_dir %>/js/**/*.js'],
        tasks: ['newer:eslint:site', 'concat', 'uglify']
      }
    }
  });

};

// Important to use `grunt` as an argument in the function
module.exports = function (grunt) {

  // Configure Sass Directory Import task
  // Watches directories for scss file name _all and imports all partials into that file
  grunt.config('sass_directory_import', {
    options: {
      quiet: true,
    },
    files: {
      // The file pattern to add @imports to.
      src: ['<%= opts.build_dir %>/scss/**/_all.scss']
    }
  });

  // Configure Sass task
  // Task to run sass on defined scss file(s)
  grunt.config('sass', {
    options: {
      implementation: require('node-sass'), // Use Node-sass as implementation option, rather than dart-sass
      sourceMap: true
    },
    dist: {
      options: {
        banner: '/*! Test */'
      },
      files: [{
          src: '<%= opts.build_dir %>/scss/compile.scss',
          dest: '<%= opts.dist_dir %>/css/style.css'
        }
      ]
    }
  });

  // Configure Postcss task
  // Task to run postcss on files in dist/css/ and apply additional processors
  grunt.config('postcss', {
    options: {
      map: false,
      processors: [
        require('autoprefixer')(),
        require('postcss-pxtorem')({
          rootValue: 16,
          unitPrecision: 2, // Decimal places
          propList: ['*'], // Apply to all elements
          replace: true, // False enables px fallback
          mediaQuery: false, // Do not apply within media queries (we use em instead)
          minPixelValue: 0
        }),
        require('cssnano')() // minify the result
      ]
    },
    dist: {
      files: [{
          src: '<%= opts.dist_dir %>/css/style.css',
          dest: '<%= opts.dist_dir %>/css/style.min.css'
        }
      ]
    }
  });

  // Configure Usebanner task through config.merge as this task is used across multiple partials
  // Appends a banner to the top of the outputted CSS file(s)
  grunt.config.merge({
    usebanner: {
      styles: {
        options: {
          position: 'top',
          banner: '<%= opts.banner %>',
          linebreak: true
        },
        files: {
          src: ['<%= opts.dist_dir %>/css/*.css']
        }
      }
    }
  });

  // Configure Watch task through config.merge as this task is used across multiple partials
  // Watches scss files for changes and then runs tasks accordingly
  grunt.config.merge({
    watch: {
      styles: {
        options: {
          event: ['changed', 'added', 'deleted']
        },
        files: ['<%= opts.build_dir %>/scss/**/*.scss'],
        tasks: ['sass_directory_import', 'sass', 'postcss', 'usebanner:styles']
      }
    }
  });

};

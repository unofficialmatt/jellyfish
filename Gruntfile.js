module.exports = function (grunt) {

    // Sets up global variables which will be used throughout the Gruntfile
    var globalConfig = {
        build_dir: 'build',
        dist_dir: 'assets',
    };

    // Use Node-sass as implementation option, rather than dart-sass
    const sass = require('node-sass');

    /**
     * BEGIN PROJECT CONFIG
     */

    grunt.initConfig({

        // Import variables
        globalConfig: globalConfig,

        // Task to remove old images from the dist directory
        clean: {
            images: ['<%= globalConfig.dist_dir %>/img/*']
        },

        copy: {
            // Task to copy required scripts from node_modules
            npm: {
                files: [
                    {
                        src: ['node_modules/jquery/dist/jquery.js'],
                        dest: '<%= globalConfig.build_dir %>/js/vendor/jquery.js'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/hamburgers/_sass/hamburgers',
                        src: ['**/*'],
                        dest: '<%= globalConfig.build_dir %>/scss/jellyfish/vendor/hamburgers'
                    }
            ],
            },
        },

        // Task to run sass on defined scss file(s)
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            dist: {
                files: [
                    {
                        src: '<%= globalConfig.build_dir %>/scss/compile.scss',
                        dest: '<%= globalConfig.dist_dir %>/css/style.css'
                    }
                ]
            }
        },

        // Task to run postcss on files in <dist_dir>/css/ and apply additional processors
        postcss: {
            options: {
                map: true,
                processors: [
                    // Add vendor prefixes
                    require('autoprefixer')(),
                    require('postcss-pxtorem')({
                        rootValue: 16,
                        unitPrecision: 2, // Decimal places
                        propList: ['*'], // Apply to all elements
                        replace: true, // False enables px fallback
                        mediaQuery: false, // Do not apply within media queries (we use em instead)
                        minPixelValue: 0
                    }),
                    // Minify the result
                    require('cssnano')()
                ]
            },
            dist: {
                src: '<%= globalConfig.dist_dir %>/css/style.css',
                dest: '<%= globalConfig.dist_dir %>/css/style.min.css'
            }
        },

        // Tasks to compress and optimize images
        imagemin: {
            // Runs on images saved in <build_dir>/img/ and outputs to <dist_dir>/img/
            images: {
                files: [{
                    expand: true,
                    cwd: '<%= globalConfig.build_dir %>/img/',
                    src: ['**/*.{png,jpg,JPG,JPEG,jpeg,svg,gif}'],
                    dest: '<%= globalConfig.dist_dir %>/img/'
                }]
            }
        },

        // Task to concatenate js files together separated by a line break
        concat: {
            options: {
                sourceMap: false,
                separator: ';\n'
            },
            site: {
                src: ['<%= globalConfig.build_dir %>/js/vendor/*.js', '<%= globalConfig.build_dir %>/js/site/*.js'],
                dest: '<%= globalConfig.dist_dir %>/js/site.js',
            },
        },

        // Task to minify javascript file(s)
        uglify: {
            options: {
                mangle: false
            },
            site: {
                files: {
                    '<%= globalConfig.dist_dir %>/js/site.min.js': ['<%= globalConfig.dist_dir %>/js/site.js']
                }
            }
        },

        // Watches directories for scss file name _all and imports all partials into that file
        sass_directory_import: {
          files: {
            // The file pattern to add @imports to.
            // The name of the file is arbitrary - I like "all".
            src: ['<%= globalConfig.build_dir %>/scss/**/_all.scss']
          },
        },

        // Task which watches files in the working directory for changes, and runs certain tasks on detection
        watch: {
            // rerun $ build when the Gruntfile is edited
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['build'],
                options: {
                    event: ['changed', 'added', 'deleted']
                }
            },
            // run 'sass_directory_import', 'sass' and 'postcss' tasks when any scss file is edited
            sass: {
                options: {
                    event: ['changed', 'added', 'deleted']
                },
                files: ['<%= globalConfig.build_dir %>/scss/**/*.scss'],
                tasks: ['sass_directory_import', 'sass', 'postcss']
            },
            // Concats and uglifies javascript files on change
            concat_js: {
                options: {
                  event: ['changed', 'added', 'deleted']
                },
                files: ['<%= globalConfig.build_dir %>/js/**/*.js'],
                tasks: ['concat', 'uglify']
            },
            // Cleans and minifies images when changes detected
            images: {
                options: {
                    event: ['changed', 'added', 'deleted']
                },
                files: ['<%= globalConfig.build_dir %>/img/**/*.{png,jpg,JPG,JPEG,jpeg,svg,gif}'],
                tasks: ['clean:images', 'imagemin:images']
            }
        },
        // browserSync watches files defined in src, and on change reloads the browser
        browserSync: {
          bsFiles: {
              src: [
                  '<%= globalConfig.dist_dir %>/css/style.min.css',
                  '<%= globalConfig.dist_dir %>/js/site.js',
                  '<%= globalConfig.dist_dir %>/img/*',
                  '**/*.php',
                  '**/*.html'
              ]
          },
          options: {
            watchTask: true,
            server: {
                baseDir: "./"
            }
        }
      },

    });

    // Initialise tasks from npm
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-sass-directory-import');

    // Grunt tasks
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('init', ['copy:npm', 'concat', 'uglify', 'sass_directory_import', 'sass', 'postcss', 'clean', 'imagemin', 'browserSync', 'watch']);
    grunt.registerTask('build', ['copy:npm', 'concat', 'uglify', 'sass_directory_import', 'sass', 'postcss', 'clean', 'imagemin']);

};

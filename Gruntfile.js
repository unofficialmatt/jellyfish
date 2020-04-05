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

        // Task to remove old images and icons from the dist directory
        clean: {
            images: ['<%= globalConfig.dist_dir %>/img/*'],
            icons:  ['<%= globalConfig.dist_dir %>/icons/*']
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
                        src: ['node_modules/reset-css/sass/_reset.scss'],
                        dest: '<%= globalConfig.build_dir %>/scss/jellyfish/vendor/_reset.scss'
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
                    require('autoprefixer')({
                        browsers: 'last 5 versions'
                    }),
                    // Convert all pixel sizes to rem based on a document default of 16px = 1rem
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
            },
            // Runs on svg files saved in <build_dir>/icons/ and outputs to <dist_dir>/icons/
            icons: {
                files: [{
                    expand: true,
                    cwd: '<%= globalConfig.build_dir %>/icons/',
                    src: ['**/*.svg'],
                    dest: '<%= globalConfig.dist_dir %>/icons/'
                }]
            }
        },

        // Task to put all of the minified svg icons into a sprite sheet
        svgstore: {
            options: {
                prefix: 'icon-', // This will prefix each ID
                svg: { // will add and override the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
                    viewBox : '0 0 100 100',
                    xmlns: 'http://www.w3.org/2000/svg'
                }
            },
            default: {
                files: {
                    '<%= globalConfig.dist_dir %>/icons/icons.svg': ['<%= globalConfig.dist_dir %>/icons/*.svg']
                }
            },
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

        // Task which watches files in the working directory for changes, and runs certain tasks on detection
        watch: {
            // rerun $ grunt when the Gruntfile is edited
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['default'],
                options: {
                    event: ['changed', 'added', 'deleted']
                }
            },
            // run 'sass' and 'postcss' tasks when any scss file is edited
            sass: {
                options: {
                    event: ['changed', 'added', 'deleted']
                },
                files: ['<%= globalConfig.build_dir %>/scss/**/*.scss'],
                tasks: ['sass', 'postcss']
            },
            // Concats and uglifies javascript files on change
            concat_js: {
                options: {
                },
                files: ['<%= globalConfig.build_dir %>/js/**/*.js'],
                tasks: ['concat', 'uglify']
            },
            // Cleans and minifies images
            images: {
                options: {
                    event: ['changed', 'added', 'deleted']
                },
                files: ['<%= globalConfig.build_dir %>/img/**/*.{png,jpg,JPG,JPEG,jpeg,svg,gif}'],
                tasks: ['clean:images', 'imagemin:images']
            },
            // Cleans, minifies and creates a spritesheet of icons
            spritesheet: {
                options: {
                    event: ['changed', 'added', 'deleted']
                },
                files: ['<%= globalConfig.build_dir %>/icons/*.svg'],
                tasks: ['clean:icons', 'imagemin:icons', 'svgstore']
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
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-svgstore');
    grunt.loadNpmTasks('grunt-browser-sync');

    // Grunt tasks
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('init', ['copy:npm', 'concat', 'uglify', 'sass', 'postcss', 'clean', 'imagemin', 'svgstore', 'browserSync', 'watch']);
    grunt.registerTask('build', ['copy:npm', 'concat', 'uglify', 'sass', 'postcss', 'clean', 'imagemin', 'svgstore']);

};

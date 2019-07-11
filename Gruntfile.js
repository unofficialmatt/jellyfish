module.exports = function (grunt) {

    // Set up global variables
    var globalConfig = {
        build_dir: 'build',
        dist_dir: 'assets',
    };

    // Project configuration
    grunt.initConfig({

        globalConfig: globalConfig,

        // Remove old images and icons
        clean: {
            images: ['<%= globalConfig.dist_dir %>/img/*'],
            icons:  ['<%= globalConfig.dist_dir %>/icons/*']
        },

        copy: {
            // Copy scripts from node_modules
            npm: {
                files: [
                    {
                        src: ['node_modules/jquery/dist/jquery.js'],
                        dest: '<%= globalConfig.build_dir %>/js/vendor/jquery.js'
                    },
                    {
                        src: ['node_modules/reset-css/sass/_reset.scss'],
                        dest: '<%= globalConfig.build_dir %>/scss/vendor/_reset.scss'
                    },
                    {
                        expand: true,
                        cwd: 'node_modules/hamburgers/_sass/hamburgers',
                        src: ['**/*'],
                        dest: '<%= globalConfig.build_dir %>/scss/vendor/hamburgers'
                    }
            ],
            },
        },

        // Define which sass files should be compiled
        sass: {
            options: {
                // outputStyle: 'expanded',
                sourceMap: true
            },
            dist: {
                files: [
                    {
                        src: '<%= globalConfig.build_dir %>/scss/base.scss',
                        dest: '<%= globalConfig.dist_dir %>/css/style.css'
                    }
                ]
            }
        },

        // Run postcss on files in dist_dir/css/ to apply autoprefix and minify
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({
                        browsers: 'last 5 versions'
                    }), // add vendor prefixes
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
                src: '<%= globalConfig.dist_dir %>/css/style.css',
                dest: '<%= globalConfig.dist_dir %>/css/style.min.css'
            }
        },

        // Compress images in build_dir/img/, output to dist_dir/img
        imagemin: {
            images: {
                files: [{
                    expand: true,
                    cwd: '<%= globalConfig.build_dir %>/img/',
                    src: ['**/*.{png,jpg,JPG,JPEG,jpeg,svg,gif}'],
                    dest: '<%= globalConfig.dist_dir %>/img/'
                }]
            },
            icons: {
                files: [{
                    expand: true,
                    cwd: '<%= globalConfig.build_dir %>/icons/',
                    src: ['**/*.svg'],
                    dest: '<%= globalConfig.dist_dir %>/icons/'
                }]
            }
        },

        // Put all of our minified svg icons into a sprite sheet
        svgstore: {
            options: {
                prefix: 'icon-', // This will prefix each ID
                svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
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

        express: {
            // go to http://localhost:9000 for live reloading
            all: {
                options: {
                    port: 9000,
                    hostname: 'localhost',
                    bases: ['.'],
                    livereload: true
                }
            }
        },
        watch: {

            // rerun $ grunt when the Gruntfile is edited
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['default'],
                options: {
                    livereload: true,
                    event: ['changed', 'added', 'deleted']
                }
            },

            // run 'sass' and 'postcss' tasks when any scss file is edited
            sass: {
                options: {
                    livereload: true,
                    event: ['changed', 'added', 'deleted']
                },
                files: ['<%= globalConfig.build_dir %>/scss/**/*.scss'],
                tasks: ['sass', 'postcss']
            },

            concat_js: {
                options: {
                    livereload: true
                },
                files: ['<%= globalConfig.build_dir %>/js/**/*.js'],
                tasks: ['concat', 'uglify']
            },

            images: {
                options: {
                    livereload: true,
                    event: ['changed', 'added', 'deleted']
                },
                files: ['<%= globalConfig.build_dir %>/img/**/*.{png,jpg,JPG,JPEG,jpeg,svg,gif}'],
                tasks: ['clean:images', 'imagemin:images']
            },

            spritesheet: {
                options: {
                    livereload: true,
                    event: ['changed', 'added', 'deleted']
                },
                files: ['<%= globalConfig.build_dir %>/icons/*.svg'],
                tasks: ['clean:icons', 'imagemin:icons', 'svgstore']
            }
        }

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
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-svgstore');

    // Default Grunt task, runs via $ grunt
    grunt.registerTask('default', ['copy:npm', 'concat', 'uglify', 'sass', 'postcss', 'clean', 'imagemin', 'svgstore', 'express', 'watch']);
    grunt.registerTask('server', ['express', 'watch']);
    grunt.registerTask('css', ['sass', 'postcss']);

};

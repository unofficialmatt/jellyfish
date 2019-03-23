module.exports = function (grunt) {
    // Project configuration
    grunt.initConfig({
        
        // Remove old images
        clean: ['assets/img/*'], 
        
        // Define which sass files should be compiled
        sass: {
            options: {
                outputStyle: 'expanded',
                sourceMap: true
            },
            dist: {
                files: [
                    {
                        src: 'build/scss/base.scss',
                        dest: 'assets/css/style.min.css'
                    }
                ]
            }
        },
        
        // Run postcss on files in assets/css/ to apply autoprefix and minify
        postcss: {
            options: {
                map: true,
                processors: [
                      require('autoprefixer')({
                        browsers: 'last 5 versions'
                    }), // add vendor prefixes
                    require('cssnano')() // minify the result
                ]
            },
            dist: {
                src: 'assets/css/*.css'
            }
        },
        
        // Compress images in build/img/, output to assets/img
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'build/img/',
                    src: ['**/*.{png,jpg,JPG,JPEG,jpeg,svg,gif}'],
                    dest: 'assets/img/'
                }]
            }
        },    

        concat: {
          options: {
                sourceMap: false,
                separator: ';\n'
          },

          site: {
            src: ['build/js/vendor/*.js', 'build/js/site/*.js'],
            dest: 'assets/js/site.js',
          },
        },

        uglify: {
          options: {
            mangle: false
          },
          site: {
            files: {
              'assets/js/site.min.js': ['assets/js/site.js']
            }
          }
        },           
        
        watch: {
            
            // rerun $ grunt when the Gruntfile is edited
            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['default'],
                options: {
                    reload: true
                }
            },
            
            // run 'sass' and 'postcss' tasks when any scss file is edited
            sass: {
                options: {
                    reload: true,
                    event: ['changed', 'added', 'deleted']
                },
                files: ['build/scss/**/*.scss'],
                tasks: [ 'sass', 'postcss']
            },

            concat_js: {
                files: ['build/js/**/*.js'],
                tasks: ['concat', 'uglify']
            },            
            
            images: {
                options: {
                    reload: true,
                    event: ['changed', 'added', 'deleted']
                },
                files: ['build/img/**/*.{png,jpg,JPG,JPEG,jpeg,svg,gif}'],
                tasks: [ 'clean', 'imagemin' ]
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
    

    // Copy required scripts from node_modules to assets
    grunt.registerTask('copyScripts', function () {
        var jquery = grunt.file.read('node_modules/jquery/dist/jquery.js');
        
        grunt.file.write('build/js/vendor/jquery.js', jquery);
    });
    
    // Default Grunt task, runs via $ grunt
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['copyScripts', 'concat', 'uglify', 'sass', 'postcss', 'clean', 'imagemin', 'watch']);

};
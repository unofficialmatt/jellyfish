module.exports = function (grunt) {
    // Project configuration
    grunt.initConfig({
        
        // Define which sass files should be compiled
        sass: {
            options: {
                outputStyle: 'expanded',
                sourceMap: true
            },
            dist: {
                files: [
                    {
                        src: 'src/scss/base.scss',
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
        
        // Compress images in src/img/, output to assets/img
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/img/',
                    src: ['**/*.{png,jpg,JPG,JPEG,jpeg,svg,gif}'],
                    dest: 'assets/img/'
                }]
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
                files: ['assets/scss/**/*.scss'],
                tasks: [ 'sass', 'postcss']
            },
            
            images: {
                options: {
                    reload: true,
                    event: ['changed', 'added', 'deleted']
                },
                files: ['src/img/**/*.{png,jpg,JPG,JPEG,jpeg,svg,gif}'],
                tasks: [ 'imagemin' ]
            }

        }


    });

    // Initialise tasks from npm
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // Copy required scripts from node_modules to assets
    grunt.registerTask('copyScripts', function () {
        var jquery = grunt.file.read('node_modules/jquery/dist/jquery.min.js');
        grunt.file.write('assets/js/jquery.min.js', jquery);
    });
    
    // Default Grunt task, runs via $ grunt
    grunt.registerTask('default', ['copyScripts', 'sass', 'postcss', 'imagemin', 'watch']);

};
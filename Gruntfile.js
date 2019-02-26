module.exports = function (grunt) {
    // Project configuration
    grunt.initConfig({
        
        // Define which sass files should be compiled
        sass: {
            options: {
                outputStyle: 'expanded', //expanded
                sourceMap: true
            },
            dist: {
                files: [
                    {
                        src: 'assets/scss/base.scss',
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

        // watch Gruntfile.js and all scss files in assets/scss and re-run tasks on file changes
        watch: {

            gruntfile: {
                files: ['Gruntfile.js'],
                tasks: ['default'],
                options: {
                    reload: true
                }
            },

            sass: {
                options: {
                    reload: true,
                    event: ['changed', 'added', 'deleted']
                },
                files: ['assets/scss/**/*.scss'],
                tasks: [ 'sass', 'postcss']
            }

        }


    });

    // Initialise tasks from npm
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');

    // Copy scripts
    grunt.registerTask('copyScripts', function () {
        var jquery = grunt.file.read('node_modules/jquery/dist/jquery.min.js');
        grunt.file.write('assets/js/jquery.min.js', jquery);
    });
    
    // Default Grunt task, runs via $ grunt
    grunt.registerTask('default', ['copyScripts', 'sass', 'postcss', 'watch']);

};
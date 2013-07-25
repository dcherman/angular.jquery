module.exports = function (grunt) {
    "use strict";

    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-contrib-uglify" );
    grunt.loadNpmTasks( "grunt-contrib-connect" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );

    grunt.initConfig({
        watch: {
            dev: {
                files: "<%= jshint.scripts %>",
                tasks: [ "default" ]
            }
        },
        connect: {
            dev: {
                options: {
                    hostname: "*",
                    port: 9001,
                    base: "."
                }
            }
        },
        uglify: {
            build: {
                options: {
                    preserveComments: "some",
                    report: "gzip"
                },
                files: {
                    "angular.jquery.min.js": [ "angular.jquery.js" ]
                }
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                newcap: true,
                eqnull: true,
                bitwise: true,
                immed: true,
                noarg: true,
                unused: true,
                undef: true,
                indent: 4,
                trailing: true,
                browser: true,
                nonew: true,
                noempty: true,
                strict: true,
                quotmark: "double",
                nonstandard: true,
                globals: {
                    angular: false,
                    jQuery: false
                }
            },
            scripts: [ "angulary.jquery.js", "test/test.js" ],
            grunt: {
                options: {
                    node: true
                },
                files: {
                    src: [ "Gruntfile.js" ]
                }
            }
        }
    });

    grunt.registerTask( "default", [ "jshint", "uglify" ]);
    grunt.registerTask( "dev", [ "default", "connect", "watch" ]);
};
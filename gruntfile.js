module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      scripts: {
        files: [
          'api/*.js',
          'public/js/*.js',
          './*.js'
        ],
        tasks: [
          'jshint',
        ]
      }
    },

    jshint: {
      files: [
        'api/*.js',
        'public/js/*.js',
        './*.js'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('default', [ 'watch' ]);

};
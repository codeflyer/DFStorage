module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-plato');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        force: true
      },
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js']
    },
    jscs: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
      options: {
        config: '.jscsrc'
      }
    },
    plato: {
      options: {
        jshint: grunt.file.readJSON('.jshintrc')
      },
      main: {
        files: {
          'reports/plato/': ['lib/**/*.js', 'test/**/*.js']
        }
      }
    },
    watch: {
      files: ['<%= jscs.files %>'],
      tasks: ['jscs', 'jshint']
    },
    /*jshint camelcase: false */
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    mocha_istanbul: {
      coveralls: {
        src: ['test/**/*.js'], // multiple folders also works
        options: {
          coverage: true,
          check: {
            lines: 75,
            statements: 75
          },
          root: './lib',
          reportFormats: ['cobertura', 'lcovonly', 'html']
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
          require: 'test/index.js'
        },
        src: ['test/**/test.*.js']
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'jscs']);
  grunt.registerTask('test', ['mochaTest']);
}
;

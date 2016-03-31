module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js']
    },
    sass: {
      all: {
        options: {
          loadPath: ["css/scss/"],
          sourcemap: 'none'
        },
        files: {
          "css/style.css": "css/scss/style.scss"
        }
      }
    },
    cssmin: {
      target: {
        files: {
          'css/style.min.css': 'css/style.css'
        }
      }
    },
    compress: {
      all: {
        options: {
            mode: 'gzip'
        },
        files: [
          {
            expand: true,
            src: 'css/style.min.css',
            dest: '',
            ext: '.gz.css'
          }
        ]
      }
    },
    img: {
      task2: {
        src: 'img'
      },
      task3: {
        src: 'letter-img'
      }
    },
    watch: {
      sass: {
        files: ['css/scss/*.scss', 'css/scss/*/*.scss'],
        tasks: ['sass'],
        options: {
          nospawn: true,
          livereload: true
        }
      }
    }
  });

  //Загрузка модулей, которые предварительно установлены
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-img');


  //Эти задания будут выполнятся сразу же когда вы в консоли напечатание grunt, и нажмете Enter
  grunt.registerTask('default', [
    'jshint', 
    'sass', 
    'watch' 
  ]);

  grunt.registerTask('build', [
    'jshint', 
    'sass',
    'cssmin',
    'compress',
    'img'
  ]);
};




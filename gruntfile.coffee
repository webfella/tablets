module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    banner: '/*\n    ' +
      '<%= pkg.description %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n    ' +
      'Copyright <%= grunt.template.today("yyyy") %> - ' +
      '<%= pkg.author.name %> - <%= pkg.author.website %>\n' +
      '*/\n'
    jshint:
      options:
        curly: true
        eqeqeq: true
        immed: true
        latedef: true
        newcap: true
        noarg: true
        sub: true
        undef: true
        unused: true
        boss: true
        eqnull: true
        browser: true
        globals:
          jQuery: true
      js:
        src: ['!gruntfile.js', 'src/js/templates/*.js']
    concat:
      options:
        stripBanners: true
      dist:
        src: ['src/js/libs/*.js', 'src/js/templates/*.js']
        dest: 'src/js/<%= pkg.name %>.js'
      swipe:
        src: ['src/js/libs/jquery-1.9.1.js', 'src/js/libs/jquery.event.move.js', 'src/js/templates/swipe.js']
        dest: 'src/js/swipe.js'
      rotate:
        src: ['src/js/libs/jquery-1.9.1.js', 'src/js/libs/jquery.spritespin.js', 'src/js/templates/rotate.js']
        dest: 'src/js/rotate.js'
    uglify:
      options:
        banner: '<%= banner %>'
        report: 'min'
      dist:
        src: '<%= concat.dist.dest %>'
        dest: 'dist/js/<%= pkg.name %>.min.js'
      swipe:
        src: '<%= concat.swipe.dest %>'
        dest: 'dist/js/swipe.min.js'
      rotate:
        src: '<%= concat.rotate.dest %>'
        dest: 'dist/js/rotate.min.js'
    qunit:
      all: 'test/*.html'
    clean: ['dist/']
    copy:
      all:
        files: [
          expand: true
          cwd: 'src/'
          src: ['*.html', 'css/*.css', 'js/*.js', 'images/**/*']
          dest: 'dist/'
        ]
      swipe:
        files: [
          expand: true
          cwd: 'src/'
          src: ['swipe*.html', 'css/swipe.css', 'js/swipe.js', 'images/*', 'images/swipe/*']
          dest: 'dist/'
        ]
      rotate:
        files: [
          expand: true
          cwd: 'src/'
          src: ['rotate*.html', 'css/rotate.css', 'js/rotate.js', 'images/*', 'images/rotate/*']
          dest: 'dist/'
        ]
    less:
      dist:
        src: 'src/less/*.less'
        dest: 'src/css/<%= pkg.name %>.css'
      swipe:
        src: ['src/less/common.less', 'src/less/swipe.less']
        dest: 'src/css/swipe.css'
      rotate:
        src: ['src/less/common.less', 'src/less/rotate.less']
        dest: 'src/css/rotate.css'
    cssmin:
      options:
        banner: '<%= banner %>'
      dist:
        files:
          'dist/css/<%= pkg.name %>.min.css': '<%= less.dist.dest %>'
      swipe:
        files:
          'dist/css/swipe.min.css': '<%= less.swipe.dest %>'
      rotate:
        files:
          'dist/css/rotate.min.css': '<%= less.rotate.dest %>'
    connect:
      server:
        options:
          port: 9000
          base: 'src'
    watch:
      js:
        files: ['src/js/*.js', '!<%= concat.dist.dest %>']
        tasks: ['jshint', 'concat']
      less:
        files: ['src/less/*.less']
        tasks: ['less']
      test:
        files: ['test/*.html', 'test/**/*.js']
        tasks: ['qunit']

  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-qunit'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  grunt.registerTask 'default', ['jshint', 'clean', 'concat', 'uglify', 'less', 'cssmin', 'copy:all']
  grunt.registerTask 'develop', ['concat', 'less', 'connect', 'watch']
  grunt.registerTask 'test', ['jshint', 'concat:dist', 'qunit', 'watch:test']

  grunt.registerTask 'swipe', ['clean', 'concat:swipe', 'uglify:swipe', 'less:swipe', 'cssmin:swipe', 'copy:swipe']
  grunt.registerTask 'rotate', ['clean', 'concat:rotate', 'uglify:rotate', 'less:rotate', 'cssmin:rotate', 'copy:rotate']

  return
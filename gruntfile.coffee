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
        src: ['!gruntfile.js', 'src/js/**/*.js', '!src/js/libs/*.js', '!<%= concat.dist.dest %>']
    concat:
      options:
        stripBanners: true
      dist:
        src: ['src/js/**/*.js', '!src/js/<%= pkg.name %>.js']
        dest: 'src/js/<%= pkg.name %>.js'
    uglify:
      options:
        banner: '<%= banner %>'
        report: 'min'
      dist:
        src: '<%= concat.dist.dest %>'
        dest: 'dist/js/<%= pkg.name %>.min.js'
    qunit:
      all: 'test/*.html'
    clean: ['dist/']
    copy:
      main:
        files: [
          expand: true
          cwd: 'src/'
          src: ['*.html', 'images/**/*', 'css/<%= pkg.name %>.css', 'js/<%= pkg.name %>.js']
          dest: 'dist/'
        ]
    less:
      development:
        src: 'src/less/*.less'
        dest: 'src/css/<%= pkg.name %>.css'
    cssmin:
      dist:
        options:
          banner: '<%= banner %>'
        files:
          'dist/css/<%= pkg.name %>.min.css': '<%= less.development.dest %>'
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

  grunt.registerTask 'default', ['jshint', 'clean', 'concat', 'uglify', 'less', 'cssmin', 'copy']
  grunt.registerTask 'develop', ['concat', 'less', 'connect', 'watch']
  grunt.registerTask 'test', ['jshint', 'concat', 'qunit', 'watch:test']

  return
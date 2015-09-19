var gulp       = require('gulp'),
    sass       = require('gulp-sass'),
    cssmin     = require('gulp-cssmin'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify     = require('gulp-uglify'),
    concat     = require('gulp-concat'),
    gutil      = require('gulp-util'),
    prefix     = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload')

var src = {
  sass: 'public/sass/**/!(_)*.sass',
  html: 'public/**/*.html',
  js  : ['public/js/**/*.js', '!public/js/**/*.min.js']
}

function onError(err) {
  console.error(err)
  gutil.beep()
}

gulp.task('sass', function() {
  gulp.src(src.sass)
      .pipe(sass().on('error', onError))
      .pipe(concat('main.min.css'))
      .pipe(prefix())
      // .pipe(cssmin())
      .pipe(gulp.dest('public/css'))
      .pipe(livereload())
})

gulp.task('html', function() {
  gulp.src(src.html)
      .pipe(livereload())
})

gulp.task('js', function() {
  gulp.src(src.js)
      .pipe(concat('app.min.js'))
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(gulp.dest('public/js'))
      .pipe(livereload())
})

gulp.task('default', function() {
  livereload.listen()
  gulp.watch(src.sass, ['sass'])
  gulp.watch(src.html, ['html'])
  gulp.watch(src.js, ['js'])
})
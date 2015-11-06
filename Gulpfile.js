var gulp       = require('gulp'),
    sass       = require('gulp-sass'),
    cssmin     = require('gulp-cssmin'),
    ngAnnotate = require('gulp-ng-annotate'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify     = require('gulp-uglify'),
    concat     = require('gulp-concat'),
    rename     = require('gulp-rename'),
    prefix     = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload')

var src = {
  sass: 'public/sass/*.sass',
  html: ['public/views/*.html', 'public/index.html'],
  js  : 'public/app/*.js'
}

function onError(err) {
  console.error("\007", err.toString())
  this.emit('end')
}

gulp.task('sass', function() {
  gulp.src('public/sass/main.sass')
      .pipe(sass().on('error', onError))
      .pipe(prefix())
      .pipe(cssmin())
      .pipe(rename('main.min.css'))
      .pipe(gulp.dest('public/css'))
      .pipe(livereload())
})

gulp.task('html', function() {
  gulp.src('public/index.html')
      .pipe(livereload())
})

gulp.task('minjs', function() {
  return gulp.src(src.js)
      .pipe(ngAnnotate().on('error', onError))
      .pipe(concat('app.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('public/js'))
      .pipe(livereload())
})


gulp.task('js', function() {
  gulp.src(src.js)
      .pipe(livereload())
})

gulp.task('default', function() {
  livereload.listen()
  gulp.watch(src.sass, ['sass'])
  gulp.watch(src.html, ['html'])
  gulp.watch(src.js, ['minjs'])
})
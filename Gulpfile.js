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

var paths = {
  src: {
    sass: 'public/sass/main.sass',
    html: ['public/views/*.html', 'public/index.html'],
    js  : 'public/app/*.js'
  },
  dist: {
    css: 'public/css',
    js: 'public/js'
  }
}

function onError(err) {
  console.error('\007', err.toString())
  this.emit('end')
}

gulp.task('html', function() {
  return gulp.src(paths.src.html)
    .pipe(livereload())
})

gulp.task('sass', function() {
  return gulp.src(paths.src.sass)
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', onError))
      .pipe(prefix())
      .pipe(cssmin())
      .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist.css))
    .pipe(livereload())
})

gulp.task('minjs', function() {
  return gulp.src(paths.src.js)
    .pipe(sourcemaps.init())
      .pipe(ngAnnotate().on('error', onError))
      .pipe(concat('app.min.js'))
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist.js))
    .pipe(livereload())
})

gulp.task('default', ['sass', 'minjs'], function() {
  livereload.listen()
  gulp.watch(paths.src.html, ['html'])
  gulp.watch(paths.src.sass, ['sass'])
  gulp.watch(paths.src.js, ['minjs'])
})
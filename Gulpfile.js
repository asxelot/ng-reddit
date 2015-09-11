var gulp = require('gulp'),
    livereload = require('gulp-livereload');

var src = {
  html: 'public/**/*.html',
  js: 'public/js/**/*.js'
};

gulp.task('html', function() {
  gulp.src(src.html)
      .pipe(livereload());
});

gulp.task('js', function() {
  gulp.src(src.js)
      .pipe(livereload());
});

gulp.task('default', function() {
  livereload.listen();
  gulp.watch(src.html, ['html']);
  gulp.watch(src.js, ['js']);
});
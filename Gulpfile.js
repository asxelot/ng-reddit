var gulp = require('gulp'),
    livereload = require('gulp-livereload');

gulp.task('js', function() {
  gulp.src('public/js/**/*.js')
      .pipe(livereload());
});

gulp.task('default', function() {
  livereload.listen();
  gulp.watch('public/js/**/*.js', ['js']);
});
var gulp = require('gulp'),
    clean = require('gulp-rimraf');

gulp.task('clean', function() {
  gulp.src(['dist'], { read: false })
    .pipe(clean());
});

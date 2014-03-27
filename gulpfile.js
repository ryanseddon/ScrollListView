var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var sweetify = require('sweetify');
var sweetjs = require('gulp-sweetjs');
var connect = require('gulp-connect');

gulp.task('build', ['lint'], function() {
    gulp.src('src/main.js')
        .pipe(sweetjs({modules: ['./src/module.sjs'], readableNames: true}))
        .pipe(browserify({
            standalone: 'ScrollListView'
        }))
        .pipe(rename('ScrollListView.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

gulp.task('lint', function() {
    gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('serve', connect.server({
    root: [__dirname],
    livereload: true
}));

gulp.task('default', ['build'], function() {
  gulp.watch('src/*.js', function(event) {
    gulp.run('build');
  });
});

var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');

// Minify CSS
gulp.task('minicss', function() {
  gulp.src('./dev/css/main.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('./build/css'));
});

// Minify JavaScript
gulp.task('minijs', function() {
  gulp.src('./dev/js/main.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

// Minify HTML
gulp.task('minihtml', function() {
  gulp.src('./dev/index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('./build'));
});


// Default
gulp.task('default', ['minicss', 'minijs', 'minihtml'], function() {
  // watch for HTML changes
  gulp.watch('./dev/index.html', function() {
    gulp.run('minihtml');
  });
});
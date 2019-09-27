const gulp = require('gulp');

const $ = require('../plugins');
const conf = require('../conf').uglify;

var gutil = require('gulp-util');

gulp.task('uglify', () => {
  return gulp.src(conf.src)
    .pipe($.uglify(conf.opts))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(conf.dest));
});
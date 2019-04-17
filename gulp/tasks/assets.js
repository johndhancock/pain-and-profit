/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const gulp = require('gulp');


module.exports = () =>
    gulp.src('./src/data/**/*')
      .pipe(gulp.dest('./dist/data'));

module.exports = () =>
  gulp.src('./src/assets/**/*')
    .pipe(gulp.dest('./dist/assets'));

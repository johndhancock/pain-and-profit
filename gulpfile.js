/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const archieml = require('gulp-archieml');
const runSequence = require('run-sequence');
const S = require('string');


const gulp = require('./gulp')([
  'assets',
  'aws',
  'aws-test',
  'browserify',
  'clear-test',
  'plain-images',
  'optimize-images',
  'resize-images',
  'scss',
  'templates',
  'server',
  'watchify',
]);
const meta = require('./meta.json');


const appName = S(meta.name).slugify().s;


gulp.task('img', (cb) => {
  runSequence('optimize-images', 'resize-images', 'plain-images', cb);
});

gulp.task('aml', () => gulp.src('./src/data/**/*.aml')
  .pipe(archieml())
  .pipe(gulp.dest('./src/js/')));

gulp.task('default', [
  'assets',
  'img',
  'scss',
  'watchify',
  'templates',
  'server',
], () => {});

gulp.task('build', ['assets', 'img', 'scss', 'templates', 'browserify']);


gulp.task('publish', (cb) => { runSequence('build', 'aws', cb); });


gulp.task('publish-test', (cb) => { runSequence('build', 'aws-test', cb); });

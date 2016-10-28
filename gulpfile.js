'use strict';

var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('default', function () {
  // do nothing for now
});


gulp.task('compile', function () {
  var tsProject = ts.createProject('tsconfig.json', { noImplicitAny: true });
  var tsResult = tsProject.src(['src/index.ts', 'stf-select-option.directive.ts', 'stf-select.directive.ts'])
        .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('bin/'));
});
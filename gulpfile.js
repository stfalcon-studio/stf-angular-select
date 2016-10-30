'use strict';

var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');

gulp.task('default', function () {
  // do nothing for now
});


gulp.task('compile', function () {
  var tsProject = ts.createProject('tsconfig.json', { noImplicitAny: false, declaration: true });
  var tsResult = tsProject.src(['src/index.ts', 'stf-select-option.directive.ts', 'stf-select.directive.ts'])
        .pipe(tsProject());
  return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done. 
        tsResult.dts.pipe(gulp.dest('dist')),
        tsResult.js.pipe(gulp.dest('dist'))
    ])
});
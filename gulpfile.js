'use strict';

var gulp = require('gulp'),
gutil = require('gulp-util'),
mocha = require('gulp-mocha');

var files = {
    main : ['spurgeon.js', 'lib/*.js'],
    test : ['test/*-spec.js']
};

gulp.task('test', function (done) {
    gulp.src(files.test)
    .pipe(mocha({reporter : 'dot'}))
    .on('error', function (error) {
        gutil.log(gutil.colors.red(error.message));
    })
    .on('end', done);
});

gulp.task('test.watch', ['test'], function () {
    gulp.watch([files.main, files.test], ['test']);
});

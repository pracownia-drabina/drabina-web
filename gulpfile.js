'use strict';

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var browserSyncLib = require('browser-sync');
var pjson = require('./package.json');
var minimist = require('minimist');
var glob = require('glob');
var imagemin = require('imagemin');

// Load all gulp plugins based on their names
// EX: gulp-copy -> copy
var plugins = gulpLoadPlugins();
plugins.imagemin.jpegtran = require('imagemin-jpegtran');

var config = pjson.config;
config.defaultNotification = function(err) {
  return {
    subtitle: err.plugin,
    message: err.message,
    sound: 'Funk',
    onLast: true,
  };
};
var args = minimist(process.argv.slice(2));
var dirs = config.directories;
var taskTarget = args.production ? dirs.destination : dirs.temporary;

// Create a new browserSync instance
var browserSync = browserSyncLib.create();

// This will grab all js in the `gulp` directory
// in order to load all gulp tasks
glob.sync('./gulp/**/*.js').filter(function(file) {
  return (/\.(js)$/i).test(file);
}).map(function(file) {
  require(file)(gulp, plugins, args, config, taskTarget, browserSync);
});

// Build production-ready code
gulp.task('build', 
  gulp.parallel('copy',
  gulp.parallel('imagemin',
  gulp.parallel('jade',
  gulp.parallel('sass', 'browserify'))))
);

// Server tasks with watch
gulp.task('serve',
  gulp.parallel('imagemin',
  gulp.parallel('copy',
  gulp.parallel('jade',
  gulp.parallel('sass',
  gulp.parallel('browserify',
  gulp.parallel('browserSync', 'watch'))))))
);

// Testing
gulp.task('test', gulp.parallel('eslint'));

// Default task
gulp.task('default', gulp.series('clean', 'build'));

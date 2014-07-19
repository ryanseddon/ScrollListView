var gulp = require('gulp'),
    gutil = require('gulp-util'),
    webpack = require('webpack'),
    webpackConfig = require('../webpack.config.js');

function webpackCallback(callback) {
  return function(err, stats) {
    if(err) {
      throw new gutil.PluginError('webpack', err);
    }
    gutil.log('[webpack]', stats.toString({
      colors: true
    }));
    callback();
  };
}

gulp.task('build:prod', function(callback) {
  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        'drop_console': true,
        'drop_debugger': true,
        'warnings': false
      }
    })
  ];

  return webpack(myConfig, webpackCallback(callback));
});

var debugBuild = webpack(webpackConfig);

gulp.task('build:debug', function(callback) {
  debugBuild.run(webpackCallback(callback));
});

gulp.task('build', ['lint', 'build:prod']);

gulp.task('build-dev', ['build:debug']);


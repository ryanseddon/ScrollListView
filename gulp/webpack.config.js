var path = require('path');
var prefix = process.cwd();

module.exports = {
  cache: true,
  entry: path.join(prefix, '/src/main.js'),
  output: {
    path: path.join(prefix, 'dist'),
    filename: 'ScrollListView.js',
    library: 'ScrollListView',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: [
          'style',
          '!css',
          '!autoprefixer-loader?browsers=last 2 versions, > 1%, Firefox ESR, ie >= 9'
        ].join('')
      },
      { test: /\.js$/, loader: 'es6-loader' },
    ]
  },
  resolve: {
    alias: {
    },
    modulesDirectories: ['node_modules', 'bower_components']
  }
};

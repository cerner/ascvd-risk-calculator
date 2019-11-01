const config = require('./webpack.dev.config.js');
const intlConfig = require('./webpack.intl.config.js');
const path = require('path');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge(intlConfig, config, {
  mode: 'production',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },
});

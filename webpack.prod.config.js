var config = require('./webpack.dev.config.js');
var webpack = require('webpack');
var path = require('path');

config.plugins.push(new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify('production')}}));
config.output = {
  path: path.join(__dirname, 'build'),
  filename: 'bundle.js'
};

module.exports = config;

const config = require('./webpack.dev.config.js');
const intlConfig = require('./webpack.intl.config.js');
const webpack = require('webpack');
const path = require('path');

config.plugins.push(new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }));
config.plugins.push(new webpack.optimize.UglifyJsPlugin({
  sourceMap: false,
  compress: {
    warnings : true
  }
}));

intlConfig.plugins.push(new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }));
intlConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
  sourceMap: false,
  compress: {
    warnings : true
  }
}));

config.output = {
  path: path.join(__dirname, 'build'),
  filename: 'bundle.js',
};

module.exports = [intlConfig, config];

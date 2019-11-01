/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: ['./intl-inject.js'],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'intl-polyfill-bundle.min.js',
    publicPath: '/build/',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
  ],
};

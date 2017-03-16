// By default eslint assumes packages imported are supposed to be dependencies,
// not devDependencies. Disabling this rule in webpack.conig.js
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const path = require('path');
var webpack = require('webpack');
var combineLoaders = require('webpack-combine-loaders');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'results': path.join(__dirname, 'fixtures', 'Results', 'index'),
    'risk_factors': path.join(__dirname, 'fixtures', 'RiskFactors', 'index'),
    'recommendations': path.join(__dirname, 'fixtures', 'Recommendations', 'index')
  },
  externals: {
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },
  module: {
    loaders: [
      {
        test: /.(jsx|js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          combineLoaders([{
            loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[name]__[local]'
            }
          }])
        )
      },
    ],
  },
  output: { path: path.join(__dirname, 'fixtures'), filename: '[name].js' },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'fixtures', 'index.html'),
      chunks: ['results'],
      filename: 'results.html'
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'fixtures', 'index.html'),
      chunks: ['risk_factors'],
      filename: 'riskfactors.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'fixtures', 'index.html'),
      chunks: ['recommendations'],
      filename: 'recommendations.html',
    }),
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};

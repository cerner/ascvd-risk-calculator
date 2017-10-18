// By default eslint assumes packages imported are supposed to be dependencies,
// not devDependencies. Disabling this rule in webpack.conig.js
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const path = require('path');
var webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'results': path.join(__dirname, 'fixtures', 'Results', 'index'),
    'risk_factors': path.join(__dirname, 'fixtures', 'RiskFactors', 'index'),
    'recommendations': path.join(__dirname, 'fixtures', 'Recommendations', 'index'),
    'translations': path.join(__dirname, 'fixtures', 'Translations', 'index'),
    'error_view': path.join(__dirname, 'fixtures', 'ErrorView', 'index')
  },
  externals: {
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.(scss|css)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
            loader: 'css-loader',
              query: {
                modules: true,
                localIdentName: '[name]__[local]'
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader?name=../../build/[name].[ext]'
      }
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
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'fixtures', 'index.html'),
      chunks: ['translations'],
      filename: 'translations.html',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'fixtures', 'index.html'),
      chunks: ['error_view'],
      filename: 'errorview.html',
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
};

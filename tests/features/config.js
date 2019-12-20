// By default eslint assumes packages imported are supposed to be dependencies,
// not devDependencies. Disabling this rule in webpack.conig.js
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const path = require('path');
var webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
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
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]',
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file-loader',
        options: {
          name: '../../build/[name].[ext]',
        },
      }
    ],
  },
  output: { path: path.join(__dirname, 'fixtures'), filename: '[name].js' },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
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

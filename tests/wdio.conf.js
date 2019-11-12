const wdioConfig = require('terra-toolkit/config/wdio/wdio.conf');
const webpackConfig = require('./features/config.js');
const path = require('path');

const config = {
  ...wdioConfig.config,
  webpackConfig,
  specs: [path.join('tests', 'wdio', '*.js')],
};

exports.config = config;

const config = require('./webpack.dev.config.js');
const intlConfig = require('./webpack.intl.config.js');
const path = require('path');

config.output = {
  path: path.join(__dirname, 'build'),
  filename: 'bundle.js',
};

config.mode = 'production';

module.exports = [intlConfig, config];

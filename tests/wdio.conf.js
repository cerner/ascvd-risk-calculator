const localIP = require('ip');
const wdioConfig = require('terra-toolkit/config/wdio/wdio.conf');
const webpackConfig = require('../webpack.dev.config.js');
const path = require('path');

//const {
//  SeleniumDocker: SeleniumDockerService,
//  ServeStaticService,
//} = require('terra-toolkit/lib/wdio/services/index');

const config = {
  ...wdioConfig.config,
  webpackConfig,
  specs: [path.join('tests', 'wdio', '*.js')],
//  services: [SeleniumDockerService, ServeStaticService],
//  serveStatic: { port: '8080' },
  onPrepare: () => console.log('asdf'),
};

if (config.seleniumDocker) {
  config.seleniumDocker.cleanup = true;
}

exports.config = config;

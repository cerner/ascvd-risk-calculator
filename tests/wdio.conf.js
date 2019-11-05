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
  baseUrl: `http://${localIP.address()}:8080`,
  specs: [path.join('tests', 'wdio', '*.js')],
//  services: [SeleniumDockerService, ServeStaticService],
//  serveStatic: { port: '8080' },
};

if (config.seleniumDocker) {
  config.seleniumDocker.cleanup = true;
}

exports.config = config;

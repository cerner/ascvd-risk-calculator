const testSettings = require('../node_modules/terra-toolkit').testSettings;
const resolve = require('path').resolve;
const nightwatchConfiguration = require('terra-toolkit/lib/nightwatch.json');

module.exports = (settings => {
  const updatedSettings = testSettings(resolve('./features/config'), settings);
  updatedSettings.globals_path = './node_modules/terra-toolkit/lib/globals.js';
  return updatedSettings;
})(nightwatchConfiguration);

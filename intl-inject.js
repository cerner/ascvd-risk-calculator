import IntlPolyfill from 'intl';
require('intl');
require('intl/locale-data/jsonp/en-US.js');
require('intl/locale-data/jsonp/en-GB.js');
require('intl/locale-data/jsonp/es.js');

/**
 * Purpose: Checks for the Intl if it is undefined and injects IntlPolyfill in the window.Intl global object.
 * Cause : Windows Update breaking the INTL library.
 */

// eslint-disable-next-line func-names
(function () {
  try {
    if (typeof (Intl) === 'undefined' || typeof (Intl.DateTimeFormat) === 'undefined') {
      window.Intl = IntlPolyfill;
      IntlPolyfill.__applyLocaleSensitivePrototypes();
    }
  } catch (error) {
    window.Intl = IntlPolyfill;
    IntlPolyfill.__applyLocaleSensitivePrototypes();
  }
}());
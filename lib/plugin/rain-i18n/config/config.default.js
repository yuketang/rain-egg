'use strict';

/**
 * egg-rain-i18n default config
 * @member Config#rainI18n
 * @property {String} SOME_KEY - some description
 */

const path = require('path');

exports.rainI18n = {
  defaultLocale: 'en',
  queryField: 'locale',
  headerField: 'X-Language',
  localeAlias: {},
  dir: undefined,
  dirs: [ path.join(process.cwd(), 'locales') ],
  functionName: '__',
};

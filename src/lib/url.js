/* global URL */

module.exports = typeof URL !== 'undefined'
  ? URL
  : require('ur' + 'l').URL

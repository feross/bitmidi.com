const debug = require('debug')('nodefoo:api')
// const memo = require('memo-async-lru')
const querystring = require('querystring')

const config = require('../../config')
const fetchConcat = require('../lib/simple-fetch')

// const MEMO_OPTS = {
//   max: 1000,
//   maxAge: 60 * 60 * 1000 // 1 hour
// }

function sendRequest (urlBase, params, cb) {
  const opts = {
    url: urlBase + '?' + querystring.stringify(params),
    json: true,
    timeout: config.apiTimeout
  }
  debug('request %s', opts.url)

  fetchConcat(opts, onResponse)

  function onResponse (err, res, data) {
    if (err) {
      return cb(new Error(`HTTP request error. ${err.message}`))
    }
    if (data.error) {
      return cb(new Error(String(data.error)))
    }
    if (res.statusCode !== 200) {
      return cb(new Error(`HTTP response error. ${res.statusCode}`))
    }
    cb(null, data.result)
  }
}

module.exports = {
  doc: {
    get: (opts, cb) => sendRequest('/api/doc/get', opts, cb)
  },
  snippet: {
    add: (opts, cb) => sendRequest('/api/snippet/add', opts, cb),
    get: (opts, cb) => sendRequest('/api/snippet/get', opts, cb),
    all: (opts, cb) => sendRequest('/api/snippet/all', opts, cb)
  }
}

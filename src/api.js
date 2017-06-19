const config = require('../config')
const log = require('nanologger')('api')
const fetchConcat = require('./lib/simple-fetch')
const memo = require('memo-async-lru')
const querystring = require('querystring')

const MEMO_OPTS = {
  max: 1000,
  maxAge: 60 * 60 * 1000 // 1 hour
}

function doc (opts, cb) {
  sendRequest('/api/doc', opts, cb)
}

const api = {
  doc: memo(doc, MEMO_OPTS)
}

module.exports = api

function sendRequest (urlBase, params, cb) {
  const opts = {
    url: urlBase + '?' + querystring.stringify(params),
    json: true,
    timeout: config.apiTimeout
  }
  log.debug('request', opts.url)

  fetchConcat(opts, onResponse)

  function onResponse (err, res, data) {
    if (err) {
      return cb(new Error('HTTP request error. ' + err.message))
    }
    if (res.statusCode !== 200) {
      return cb(new Error('HTTP non-200 response. ' + res.statusCode))
    }
    if (data.error) {
      return cb(new Error('Server API error. ' + data.error))
    }
    cb(null, data.result)
  }
}

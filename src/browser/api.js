const debug = require('debug')('nodefoo:api')
// const memo = require('memo-async-lru')
const querystring = require('querystring')

const config = require('../../config')
const fetchConcat = require('../lib/simple-fetch')

// const MEMO_OPTS = {
//   max: 1000,
//   maxAge: 60 * 60 * 1000 // 1 hour
// }

function sendGet () {
  sendRequest('GET', ...arguments)
}

function sendPost () {
  sendRequest('POST', ...arguments)
}

function sendRequest (method, urlBase, params, cb) {
  const opts = {
    url: urlBase + '?' + querystring.stringify(params),
    json: true,
    method: method,
    timeout: config.apiTimeout
  }
  debug('request %s', opts.url)

  fetchConcat(opts, onResponse)

  function onResponse (err, res, data) {
    if (err) {
      return cb(new Error(`HTTP request error. ${err.message}`))
    }
    if (data.error) {
      let err = new Error(data.error.message)
      if (data.error.code) err.code = data.error.code
      return cb(err)
    }
    if (res.statusCode !== 200) {
      return cb(new Error(`HTTP response error. ${res.statusCode}`))
    }
    cb(null, data.result)
  }
}

module.exports = {
  doc: {
    get: (opts, cb) => sendGet('/api/doc/get', opts, cb)
  },
  snippet: {
    add: (opts, cb) => sendPost('/api/snippet/add', opts, cb),
    vote: (opts, cb) => sendPost('/api/snippet/vote', opts, cb),
    get: (opts, cb) => sendGet('/api/snippet/get', opts, cb),
    all: (opts, cb) => sendGet('/api/snippet/all', opts, cb)
  }
}

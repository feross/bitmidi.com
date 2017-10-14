module.exports = {
  doc: {
    get: (opts, cb) => sendGet('/doc/get', opts, cb)
  },
  snippet: {
    add: (opts, cb) => sendPost('/snippet/add', opts, cb),
    vote: (opts, cb) => sendPost('/snippet/vote', opts, cb),
    get: (opts, cb) => sendGet('/snippet/get', opts, cb),
    all: (opts, cb) => sendGet('/snippet/all', opts, cb),
    search: (opts, cb) => sendGet('/snippet/search', opts, cb)
  }
}

const debug = require('debug')('nodefoo:api')
const querystring = require('querystring')

const config = require('../../config')
const fetchConcat = require('../lib/simple-fetch')

function sendGet () {
  sendRequest('GET', ...arguments)
}

function sendPost () {
  sendRequest('POST', ...arguments)
}

function sendRequest (method, urlBase, params, cb) {
  const opts = {
    url: '/api' + urlBase + '?' + querystring.stringify(params),
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

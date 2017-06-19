// TODO: publish to npm

/* global fetch */

module.exports = simpleFetch

function simpleFetch (opts, cb) {
  opts = typeof opts === 'string' ? {url: opts} : Object.assign({}, opts)

  if (opts.headers == null) opts.headers = {}

  if (opts.json) opts.headers.accept = 'application/json'
  if (opts.json && opts.body) {
    opts.headers['content-type'] = 'application/json'
    opts.body = JSON.stringify(opts.body)
  }
  if (opts.body && !opts.method) opts.method = 'POST'
  if (opts.method) opts.method = opts.method.toUpperCase()

  opts.mode = 'cors'
  opts.credentials = opts.withCredentials ? 'include' : 'same-origin'

  const res = {
    headers: {},
    rawHeaders: []
  }

  fetch(opts.url, opts)
    .then(onResponse)
    .then(onText, onError)

  function onResponse (response) {
    res.url = response.url
    res.statusCode = response.status
    res.statusMessage = response.statusText
    response.headers.forEach(function (header, key) {
      res.headers[key.toLowerCase()] = header
      res.rawHeaders.push(key, header)
    })
    return response.text()
  }

  function onText (text) {
    if (opts.json) {
      try {
        text = JSON.parse(text)
      } catch (err) {
        return onError(err)
      }
    }
    if (cb) cb(null, res, text)
    cb = null
  }

  function onError (err) {
    if (cb) cb(err)
    cb = null
  }
}

;['get', 'post', 'put', 'patch', 'head', 'delete'].forEach(function (method) {
  simpleFetch[method] = function (opts, cb) {
    if (typeof opts === 'string') opts = {url: opts}
    opts.method = method.toUpperCase()
    return simpleFetch(opts, cb)
  }
})

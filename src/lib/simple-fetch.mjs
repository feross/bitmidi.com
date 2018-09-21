// TODO: publish to npm

/* global fetch, Headers */

export default async function simpleFetch (opts) {
  opts = typeof opts === 'string' ? { url: opts } : Object.assign({}, opts)

  opts.headers = new Headers(opts.headers || {})

  if (opts.json) opts.headers.set('accept', 'application/json')
  if (opts.json && opts.body) {
    opts.headers.set('content-type', 'application/json')
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

  const response = await fetch(opts.url, opts)

  res.url = response.url
  res.statusCode = response.status
  res.statusMessage = response.statusText
  response.headers.forEach(function (header, key) {
    res.headers[key.toLowerCase()] = header
    res.rawHeaders.push(key, header)
  })

  res.body = opts.json
    ? await response.json()
    : await response.text()

  return res
}

;['get', 'post', 'put', 'patch', 'head', 'delete'].forEach(function (method) {
  simpleFetch[method] = function (opts) {
    if (typeof opts === 'string') opts = { url: opts }
    opts.method = method.toUpperCase()
    return simpleFetch(opts)
  }
})

// TODO: publish to npm

const pathToRegexp = require('path-to-regexp')
const querystring = require('querystring')

class Router {
  constructor (routes) {
    this._routes = routes.map(route => {
      const [name, path] = route
      const keys = []
      const regexp = pathToRegexp(path, keys)
      return { name, path, keys, regexp }
    })

    this._compilers = {}
    routes.forEach(route => {
      const [name, path] = route
      this._compilers[name] = pathToRegexp.compile(path)
    })
  }

  match (url) {
    const index = url.indexOf('?')
    const pathname = index >= 0
      ? url.slice(0, index)
      : url
    const query = index >= 0
      ? querystring.decode(url.slice(index + 1))
      : {}

    const ret = {
      name: null,
      params: {},
      url,
      pathname,
      query
    }
    for (const route of this._routes) {
      const matches = route.regexp.exec(pathname)
      if (!matches) continue

      // Found a matching route
      ret.name = route.name
      matches.slice(1).forEach((paramValue, paramIndex) => {
        const param = route.keys[paramIndex].name
        // Remove URL encoding from the param values. Accommodates whitespace in both
        // x-www-form-urlencoded and regular percent-encoded form.
        paramValue = decodeURIComponent(paramValue.replace(/\+/g, ' '))
        ret.params[param] = paramValue
      })
      break
    }
    return ret
  }

  toUrl (name, data) {
    return this._compilers[name](data)
  }
}

module.exports = Router

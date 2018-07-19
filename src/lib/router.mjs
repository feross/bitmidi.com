// TODO: publish to npm

import pathToRegexp from 'path-to-regexp'
import fromEntries from 'fromentries'

export default class Router {
  constructor (routes) {
    this._routes = routes.map(route => {
      const { name, path, query = {} } = route
      const keys = []
      const regexp = pathToRegexp(path, keys)
      return { name, path, query, keys, regexp }
    })

    this._compilers = {}
    routes.forEach(route => {
      const { name, path } = route
      this._compilers[name] = pathToRegexp.compile(path)
    })
  }

  match (rawUrl) {
    const { pathname, searchParams } = new URL(rawUrl, 'http://example.com')

    const searchStr = [...searchParams].length !== 0
      ? `?${searchParams}`
      : ''

    const ret = {
      name: null,
      url: `${pathname}${searchStr}`,
      params: {},
      query: null,
      canonicalUrl: null
    }

    for (const route of this._routes) {
      const matches = route.regexp.exec(pathname)
      if (!matches) continue

      // Found a matching route
      ret.name = route.name
      matches.slice(1).forEach((paramValue, paramIndex) => {
        const param = route.keys[paramIndex].name
        // Remove URL encoding from the param values. Accommodates whitespace in
        // both x-www-form-urlencoded and regular percent-encoded form.
        paramValue = decodeURIComponent(paramValue.replace(/\+/g, ' '))
        ret.params[param] = paramValue
      })
      ret.query = { ...route.query, ...fromEntries(searchParams) }

      // Only include whitelisted query params in the canonical url
      for (let key of searchParams.keys()) {
        if (!('query' in route) || !(key in route.query)) {
          searchParams.delete(key)
        }
      }
      const canonicalSearchStr = [...searchParams].length !== 0
        ? `?${searchParams}`
        : ''
      ret.canonicalUrl = `${pathname}${canonicalSearchStr}`

      break
    }
    return ret
  }

  toUrl (name, data) {
    return this._compilers[name](data)
  }
}

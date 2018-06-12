// TODO: publish to npm

import pathToRegexp from 'path-to-regexp'
import nodeUrl from 'url' // TODO: remove for Node 10

const URL = nodeUrl.URL || window.URL

export default class Router {
  constructor (routes) {
    this._routes = routes.map(route => {
      const { name, path, defaultQuery } = route
      const keys = []
      const regexp = pathToRegexp(path, keys)
      return { name, path, defaultQuery, keys, regexp }
    })

    this._compilers = {}
    routes.forEach(route => {
      const { name, path } = route
      this._compilers[name] = pathToRegexp.compile(path)
    })
  }

  match (url) {
    const { pathname, searchParams } = new URL(url, 'http://example.com')

    const searchStr = [...searchParams].length !== 0
      ? `?${searchParams}`
      : ''

    const ret = {
      name: null,
      params: {},
      url: `${pathname}${searchStr}`,
      pathname,
      query: null
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
      ret.query = { ...route.defaultQuery, ...mapToObj(searchParams) }
      break
    }
    return ret
  }

  toUrl (name, data) {
    return this._compilers[name](data)
  }
}

function mapToObj (map) {
  return [...map]
    .reduce((obj, [key, val]) => {
      obj[key] = val
      return obj
    }, {})
}

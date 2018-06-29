// TODO: publish to npm

import pathToRegexp from 'path-to-regexp'
import fromEntries from 'fromentries'

export default class Router {
  constructor (routes) {
    this._routes = routes.map(route => {
      const { name, path, queryDefault, queryWhitelist } = route
      const keys = []
      const regexp = pathToRegexp(path, keys)
      return { name, path, queryDefault, queryWhitelist, keys, regexp }
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
      ret.query = { ...route.queryDefault, ...fromEntries(searchParams) }

      // Only include whitelisted query params in the canonical url
      const { queryWhitelist = [] } = route
      for (let key of searchParams.keys()) {
        if (!queryWhitelist.includes(key)) {
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

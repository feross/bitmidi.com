'use strict'

const debug = require('debug')('nodefoo:store')

const api = require('./api')
const config = require('../config')

const store = {
  location: {
    name: null,
    params: {},
    pathname: null
  },
  app: {
    title: null,
    width: 0,
    height: 0
  },
  doc: null,
  errors: []
}

const SKIP_DEBUG = [
  'APP_RESIZE'
]

const Location = require('./lib/location')
const routes = require('./routes')

const loc = new Location(routes, (location, source) => {
  dispatch('LOCATION_CHANGED', location)
})

function dispatch (type, data) {
  if (!SKIP_DEBUG.includes(type)) {
    debug('%s %o', type, data)
  }

  switch (type) {
    /**
     * LOCATION
     */

    case 'LOCATION_PUSH': {
      const pathname = data
      if (pathname !== store.location.pathname) loc.push(pathname)
      return
    }

    case 'LOCATION_REPLACE': {
      const pathname = data
      if (pathname !== store.location.pathname) loc.replace(pathname)
      return
    }

    case 'LOCATION_CHANGED': {
      Object.assign(store.location, data)
      if (config.isBrowser) window.ga('send', 'pageview', data.pathname)
      return update()
    }

    /**
     * APP
     */

    case 'APP_TITLE': {
      const title = data
      store.app.title = title
        ? title + ' – ' + config.name
        : config.name
      return update()
    }

    case 'APP_RESIZE': {
      store.app.width = data.width
      store.app.height = data.height
      return update()
    }

    /**
     * DOC
     */

    case 'FETCH_DOC': {
      api.doc(data, (err, doc) => {
        dispatch('FETCH_DOC_DONE', { err, doc })
      })
      return
    }

    case 'FETCH_DOC_DONE': {
      const { err, doc } = data
      if (err) return addError(err)
      store.doc = doc
      return update()
    }

    default: {
      throw new Error(`Unrecognized dispatch type "${type}"`)
    }
  }
}

function addError (err) {
  store.errors.push(err)
  update()
}

let updating = false

function update () {
  // Prevent infinite recursion when calling dispatch() during an update()
  if (updating) return
  debug('update')
  updating = true; store.update(); updating = false
}

// Add `dispatch()` function. Not enumerable (not app data). Not writable (prevent accidents).
Object.defineProperty(store, 'dispatch', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: dispatch
})

// Add `update()` function. Should be overwritten. Not enumerable (not app data).
Object.defineProperty(store, 'update', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: () => {}
})

// Prevent unexpected properties from being added to `store`. Also, prevent existing
// properties from being "configured" (changed to getter/setter, made non-enumerable, etc.)
Object.seal(store)

module.exports = store

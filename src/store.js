const debug = require('debug')('store')

// const api = require('./api')
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
      const location = data
      store.location = location
      if (config.isBrowser) window.ga('send', 'pageview', location.pathname)
      return update()
    }

    /**
     * APP
     */

    case 'APP_TITLE': {
      store.app.title = data
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
      // const url = '/' + state.params.wildcard
      // api.doc({ url }, (err, doc) => {
      //   if (err) throw err
      //   state.doc = doc
      //   emitter.emit('render')
      // })
      return update()
    }

    default: {
      throw new Error('Unrecognized dispatch type: ' + type)
    }
  }
}

function addError (err) {
  store.errors.push(err)
  update()
}

let updating = false

function update () {
  if (updating) return
  // Support calls to dispatch() during an update(), but don't recurse infinitely
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

const { h, render } = require('preact') /** @jsx h */
const Provider = require('preact-context-provider')

const App = require('../views/app')
const createStore = require('../store')
const config = require('../../config')

const { store, dispatch } = createStore(update)
let root = document.getElementById('app')

Object.assign(store, window.storeInit)

// Show server-generated errors
store.errors.map(error => window.alert(error.message))

dispatch('LOCATION_REPLACE', window.location.pathname)
dispatch('RUN_PENDING_DISPATCH')
update()

function update () {
  const jsx = (
    <Provider store={store} dispatch={dispatch} theme={config.theme}>
      <App />
    </Provider>
  )
  root = render(jsx, document.body, root)
}

/**
 * DEVELOPMENT
 */

// Measure page speed
console.timeEnd('render')
window.addEventListener('load', () => console.timeEnd('load'))

function debug (enable, verbose) {
  window.localStorage.debug = enable && verbose ? '*' : enable ? '*,-*verbose*' : ''
  window.location.reload()
}

// Expose important functions for easy debugging from dev tools
Object.assign(window, { store, dispatch, update, debug })

// Enable react dev tools (excluded in production)
require('preact/devtools')

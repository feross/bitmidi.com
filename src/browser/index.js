const { h, render } = require('preact') /** @jsx h */
const Provider = require('preact-context-provider')

const App = require('../views/app')
const createStore = require('../store')

let root = document.getElementById('app')

const { store, dispatch } = createStore(update)

Object.assign(store, window.storeInit)

dispatch('LOCATION_REPLACE', window.location.pathname)

function update () {
  const jsx = (
    <Provider store={store} dispatch={dispatch}>
      <App />
    </Provider>
  )
  root = render(jsx, document.body, root)
}

/**
 * DEVELOPMENT
 */

window.store = store
window.dispatch = dispatch

// Measure page speed
console.timeEnd('render')
window.addEventListener('load', () => console.timeEnd('load'))

// React Developer Tools (Excluded in production)
require('preact/devtools')

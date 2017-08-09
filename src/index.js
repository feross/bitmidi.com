const { h, render } = require('preact') /** @jsx h */
const Provider = require('preact-context-provider')

const App = require('./views/app')
const store = require('./store')

store.update = update
store.dispatch('LOCATION_REPLACE', window.location.pathname)

function update () {
  const jsx = (
    <Provider store={store}>
      <App />
    </Provider>
  )
  render(jsx, document.body, document.getElementById('app'))
}

/**
 * DEVELOPMENT
 */

window.store = store

// Measure page speed
console.timeEnd('render')
window.addEventListener('load', () => console.timeEnd('load'))

// React Developer Tools (Excluded in production)
require('preact/devtools')

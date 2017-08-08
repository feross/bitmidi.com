const { h, render } = require('preact') /** @jsx h */
const Provider = require('preact-context-provider')

const App = require('./views/app')
const Location = require('./lib/location')
const routes = require('./routes')
const store = require('./store')

store.update = function update () {
  const jsx = (
    <Provider store={store}>
      <App />
    </Provider>
  )
  render(jsx, document.body, document.getElementById('app'))
}

const loc = new Location(routes, (location, source) => {
  store.dispatch('LOCATION_CHANGE', location)
  if (source === 'push') window.scroll(0, 0)
})

// Global variables
window.loc = loc
window.player = null

/**
 * DEVELOPMENT
 */

// Debugging aid
window.store = store

// Measure page speed
console.timeEnd('render')
window.addEventListener('load', () => console.timeEnd('load'))

// React Developer Tools (Excluded in production)
require('preact/devtools')

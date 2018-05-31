import { render } from 'preact'

import createStore from '../store'
import debugHelper from '../lib/debug-helper'
import getProvider from '../views/provider'

let root = document.getElementById('root')
const { store, dispatch } = createStore(update)

// Use server-initialized store values
Object.assign(store, window.initStore)

const loc = window.location
dispatch('LOCATION_REPLACE', loc.pathname + loc.search + loc.hash)
dispatch('RUN_PENDING_DISPATCH')
window.addEventListener('load', () => dispatch('APP_IS_LOADED'))

update()

function update () {
  const jsx = getProvider(store, dispatch)
  root = render(jsx, document.body, root)
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .catch(err => console.error('Unable to register service worker.', err))
}

/**
 * DEVELOPMENT
 */

// Measure time to first render
console.timeEnd('render')

// Expose important functions for dev tools debugging
window.App = { store, dispatch, update, debug: debugHelper }

if (process.env.NODE_ENV !== 'production') {
  // Enable react dev tools
  require('preact/devtools')
}

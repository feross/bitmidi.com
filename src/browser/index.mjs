import './babel-helpers'

import { render } from 'preact'

import createStore from '../store'
import debugHelper from '../lib/debug-helper'
import getProvider from '../views/provider'

let root = document.getElementById('root')
const { store, dispatch } = createStore(update)

// Use server-initialized store values
Object.assign(store, window.storeInit)

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

// Expose important functions for dev tools debugging
Object.assign(window, { store, dispatch, update, debug: debugHelper })

// Measure time to first render
console.timeEnd('render')

// Enable react dev tools (excluded in production)
// require('preact/devtools')

import { render } from 'preact'

import createStore from '../store'
import debug from '../lib/debug-helper'
import getProvider from '../views/provider'

let root = document.getElementById('root')
const { store, dispatch } = createStore(update)

// Use server-initialized store values
Object.assign(store, window.initStore)

const loc = window.location
dispatch('LOCATION_REPLACE', loc.pathname + loc.search + loc.hash)
dispatch('RUN_PENDING_DISPATCH')
window.addEventListener('load', () => dispatch('APP_IS_LOADED'))

// Debugging
Object.assign(window, { store, dispatch, update, debug })
if (process.env.NODE_ENV !== 'production') require('preact/devtools')

update()

console.timeEnd('render') // Measure time to first render

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.mjs')
    .catch(err => console.error('Unable to register service worker.', err))
}

function update () {
  const jsx = getProvider(store, dispatch)
  root = render(jsx, document.body, root)
}

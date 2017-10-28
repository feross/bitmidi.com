import './babel-helpers'

import { h, render } from 'preact' /** @jsx h */
import Provider from 'preact-context-provider'

import App from '../views/app'
import createStore from '../store'
import config from '../../config'
import debugHelper from '../lib/debug-helper'

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
  const jsx = (
    <Provider store={store} dispatch={dispatch} theme={config.theme}>
      <App />
    </Provider>
  )
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

import { render } from 'preact'
import dragDrop from 'drag-drop'
import fileToArrayBuffer from 'file-to-array-buffer'

import createStore from '../store'
import debug from '../lib/debug-helper'
import getProvider from '../views/provider'

let root = document.getElementById('root')
const { store, dispatch } = createStore(update)

// Expose for debugging
Object.assign(window, { store, dispatch, update, debug })
if (process.env.NODE_ENV !== 'production') require('preact/devtools')

// Use server-initialized store
Object.assign(store, window.initStore)

// Dispatch initial events
const { pathname, search, hash } = window.location
dispatch('LOCATION_REPLACE', pathname + search + hash)
dispatch('PENDING_DISPATCH')
window.addEventListener('load', () => dispatch('APP_IS_LOADED'))

// Render the UI
update()

// Measure time to first render
console.timeEnd('render')

// Register service worker
if (typeof navigator.serviceWorker === 'function') {
  navigator.serviceWorker
    .register('/service-worker.mjs', { updateViaCache: 'none' })
}

// Play drag-and-dropped MIDI files
dragDrop('body', async files => {
  const buf = new Uint8Array(await fileToArrayBuffer(files[0]))
  dispatch('MIDI_PLAY_BUFFER', buf)
})

function update () {
  const jsx = getProvider(store, dispatch)
  root = render(jsx, document.body, root)
}

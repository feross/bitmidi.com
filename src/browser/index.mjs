import { render } from 'preact'
import dragDrop from 'drag-drop'
import fileToArrayBuffer from 'file-to-array-buffer'

import createStore from '../store'
import debug from '../lib/debug-helper'
import getProvider from '../views/provider'
import { load, play } from '../browser/player'

let root = document.getElementById('root')
const { store, dispatch } = createStore(update)

// Use server-initialized store
Object.assign(store, window.initStore)

// Dispatch initial events
const { pathname, search, hash } = window.location
dispatch('LOCATION_REPLACE', pathname + search + hash)
dispatch('PENDING_DISPATCH')
window.addEventListener('load', () => dispatch('APP_IS_LOADED'))

// Expose functions for debugging
Object.assign(window, { store, dispatch, update, debug })
if (process.env.NODE_ENV !== 'production') require('preact/devtools')

// Render the UI
update()

// Measure time to first render
console.timeEnd('render')

// Register service worker
navigator.serviceWorker
  .register('/service-worker.mjs', { updateViaCache: 'none' })

// Play drag-and-dropped MIDI files
dragDrop('body', async files => {
  const file = new Uint8Array(await fileToArrayBuffer(files[0]))
  load(file)
  play()
})

function update () {
  const jsx = getProvider(store, dispatch)
  root = render(jsx, document.body, root)
}

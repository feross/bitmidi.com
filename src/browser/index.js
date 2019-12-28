/* eslint-disable import/first */
if (process.env.NODE_ENV !== 'production') require('preact/debug')

import { hydrate, render } from 'preact'
import dragDrop from 'drag-drop'
import fileToArrayBuffer from 'file-to-array-buffer'
import unmuteIosAudio from 'unmute-ios-audio'
import colorSchemeChange from 'color-scheme-change'

import createStore from '../store'
import debug from '../lib/debug-helper'
import getProvider from '../views/provider'

const root = document.getElementById('root')
const { store, dispatch } = createStore(update)

// Expose for debugging
Object.assign(window, { store, dispatch, update, debug })

// Use server-initialized store
Object.assign(store, window.initStore)

// Dispatch initial events
const { pathname, search, hash } = window.location
dispatch('LOCATION_REPLACE', pathname + search + hash)
dispatch('PENDING_DISPATCH')
window.addEventListener('load', () => dispatch('APP_IS_LOADED'))

// Hydrate the UI
const jsx = getProvider(store, dispatch)
hydrate(jsx, root)

// Measure time to first render
console.timeEnd('render')

// Enable/unmute WebAudio on iOS, even while mute switch is on
unmuteIosAudio()

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js', { updateViaCache: 'none' })
}

// Play drag-and-dropped MIDI files
dragDrop('body', async files => {
  const buf = new Uint8Array(await fileToArrayBuffer(files[0]))
  dispatch('MIDI_PLAY_BUFFER', buf)
})

// Detect color scheme changes
colorSchemeChange(colorScheme => {
  // Ignore color scheme changes in browser that don't support 'color-scheme'
  // TODO: Remove once Chrome supports 'color-scheme'
  // https://bugs.chromium.org/p/chromium/issues/detail?id=939811
  if (!window.CSS.supports('color-scheme: light dark')) return
  dispatch('APP_COLOR_SCHEME', colorScheme)
})

function update () {
  const jsx = getProvider(store, dispatch)
  render(jsx, root)
}

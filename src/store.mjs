'use strict'

import Debug from 'debug'

import api from './api'
import config from '../config'
import Location from './lib/location'
import routes from './routes'

const debug = Debug('bitmidi:store')
const debugVerbose = Debug('bitmidi:store:verbose')

const DEBUG_VERBOSE = new Set([
  'APP_RESIZE'
])

export default function createStore (render, onPendingChange = () => {}) {
  const store = {
    location: {
      name: null,
      params: {},
      url: null,
      query: {},
      pathname: null
    },

    app: {
      title: null, // Page title
      description: null, // Page meta description
      width: 0,
      height: 0,
      isLoaded: false, // Did window.onload() fire?
      pending: 0
    },

    fatalError: null,
    errors: [],

    // local data
    data: {
      midis: {} // midi.slug -> midi
    },

    views: {
      search: {}, // 'query' -> { total: 0, '0': ['slug-1', 'slug-2'] } }
      all: {
        total: 0
      }
    }
  }

  const loc = new Location(routes, (location, source) => {
    dispatch('LOCATION_CHANGED', { location, source })
  })

  function incrementPending () {
    store.app.pending += 1
    onPendingChange()
  }

  function decrementPending () {
    store.app.pending -= 1
    onPendingChange()
  }

  async function dispatch (type, data) {
    try {
      const ret = await _dispatch(type, data)
      return ret
    } catch (err) {
      addError(err)
      if (type.endsWith('_START')) decrementPending()
      update()
    }
  }

  async function _dispatch (type, data) {
    if (typeof type === 'function') {
      const thunk = type
      return thunk(dispatch)
    }

    if (type.endsWith('_START')) incrementPending()
    if (type.endsWith('_DONE')) decrementPending()

    if (DEBUG_VERBOSE.has(type)) debugVerbose('%s %o', type, data)
    else debug('%s %o', type, data)

    switch (type) {
      /**
       * LOCATION
       */

      case 'LOCATION_PUSH': {
        const url = data
        if (url !== store.location.url) loc.push(url)
        return
      }

      case 'LOCATION_REPLACE': {
        const url = data
        if (url !== store.location.url) loc.replace(url)
        return
      }

      case 'LOCATION_CHANGED': {
        const { location, source } = data
        store.location = location

        // Clear fatal errors on page navigation
        store.fatalError = null

        if (config.isBrowser) {
          if (source === 'push') window.scroll(0, 0)
          window.ga('send', 'pageview', location.url)
        }
        return update()
      }

      /**
       * APP
       */

      case 'APP_META': {
        let title = [...data.title] || []
        if (typeof data.title === 'string') title = [data.title]
        title.push(config.title)
        store.app.title = title.map(str => str.trim()).join(' – ')

        store.app.description = data.description != null
          ? data.description.trim()
          : config.description

        return update()
      }

      case 'APP_RESIZE': {
        store.app.width = data.width
        store.app.height = data.height
        return update()
      }

      case 'APP_IS_LOADED': {
        store.app.isLoaded = true
        return update()
      }

      /**
       * MIDI
       */

      case 'MIDI_GET_START': {
        return update()
      }

      case 'MIDI_GET_DONE': {
        const { result } = data
        addMidi(result)
        return update()
      }

      case 'MIDI_ALL_START': {
        return update()
      }

      case 'MIDI_ALL_DONE': {
        const { query, total, results } = data
        const { views } = store

        results.map(addMidi)
        views.all.total = total
        views.all[query.page] = results.map(midi => midi.slug)
        return update()
      }

      case 'MIDI_SEARCH_START': {
        return update()
      }

      case 'MIDI_SEARCH_DONE': {
        const { query, total, results } = data
        const { views } = store

        results.map(addMidi)
        if (!views.search[query.q]) views.search[query.q] = {}
        views.search[query.q].total = total
        views.search[query.q][query.page] = results.map(midi => midi.slug)
        return update()
      }

      case 'GO_MIDI_RANDOM_START': {
        return update()
      }

      case 'GO_MIDI_RANDOM_DONE': {
        const { result } = data
        addMidi(result)
        dispatch('LOCATION_PUSH', result.url)
        return
      }

      /**
       * SEARCH
       */

      case 'SEARCH_INPUT': {
        store.lastSearch = data

        if (data === '') {
          dispatch('LOCATION_REPLACE', '/')
        } else {
          const url = `/search?${new URLSearchParams({ q: data })}`
          dispatch(
            store.location.name === 'search' ? 'LOCATION_REPLACE' : 'LOCATION_PUSH',
            url
          )
        }
        return
      }

      /**
       * PENDING
       */

      case 'PENDING_DISPATCH': {
        if (window.localStorage.pendingDispatch == null) return

        let event
        try {
          event = JSON.parse(window.localStorage.pendingDispatch)
        } catch (err) {}

        delete window.localStorage.pendingDispatch

        dispatch(event.type, event.data)
        return update()
      }

      default: {
        throw new Error(`Unrecognized dispatch type "${type}"`)
      }
    }
  }

  // function addPendingDispatch (type, data) {
  //   window.localStorage.pendingDispatch = JSON.stringify({ type, data })
  // }

  function addError (err) {
    const { message, code = null, stack } = err
    store.errors.push({ message, code })
    console.error(stack)
  }

  function addMidi (midi) {
    store.data.midis[midi.slug] = midi
  }

  let isRendering = false
  let isUpdatePending = false

  function update () {
    // Prevent infinite recursion when dispatch() is called during an update()
    if (isRendering) {
      isUpdatePending = true
      return
    }
    debugVerbose('update')

    isRendering = true
    render()
    isRendering = false

    isUpdatePending = false
    if (isUpdatePending) update()
  }

  return {
    store,
    dispatch
  }
}

'use strict'

import Debug from 'debug'
import querystring from 'querystring'

import api from './api'
import config from '../config'
import Location from './lib/location'
import routes from './routes'

const debug = Debug('bitmidi:store')
const debugVerbose = Debug('bitmidi:store:verbose')

const DEBUG_VERBOSE = new Set([
  'APP_RESIZE'
])

export default function createStore (render, onFetchDone = () => {}) {
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
      fetchCount: 0
    },

    fatalError: null,
    errors: [],
    userName: null,

    // local data
    midis: {}, // midi.id -> midi
    searches: {}, // search.q -> search

    // local data views
    topMidiIds: [] // [ midi.id ]
  }

  const loc = new Location(routes, (location, source) => {
    dispatch('LOCATION_CHANGED', { location, source })
  })

  function incrementFetchCount () {
    store.app.fetchCount += 1
  }

  function decrementFetchCount () {
    store.app.fetchCount -= 1
    onFetchDone()
  }

  async function dispatch (type, data) {
    try {
      await _dispatch(type, data)
    } catch (err) {
      addError(err)
      if (type.startsWith('API_') && !type.endsWith('_DONE')) decrementFetchCount()
      update()
    }
  }

  async function _dispatch (type, data) {
    if (DEBUG_VERBOSE.has(type)) debugVerbose('%s %o', type, data)
    else debug('%s %o', type, data)

    // Reference counter for pending fetches
    if (type.startsWith('API_') && !type.endsWith('_DONE')) incrementFetchCount()
    if (type.startsWith('API_') && type.endsWith('_DONE')) decrementFetchCount()

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
        const title = data.title != null
          ? data.title.trim() + ' – ' + config.title
          : config.title

        const description = data.description != null
          ? data.description.trim()
          : config.description

        store.app.title = title
        store.app.description = description
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

      case 'API_MIDI_GET': {
        dispatch('API_MIDI_GET_DONE', await api.midi.get(data))
        return update()
      }

      case 'API_MIDI_GET_DONE': {
        const midi = data
        addMidi(midi)
        return update()
      }

      case 'API_MIDI_ALL': {
        dispatch('API_MIDI_ALL_DONE', await api.midi.all(data))
        return update()
      }

      case 'API_MIDI_ALL_DONE': {
        const midis = data
        midis.map(addMidi)
        store.topMidiIds = midis.map(midi => midi.id)
        return update()
      }

      /**
       * SEARCH
       */

      case 'SEARCH_INPUT': {
        store.lastSearch = data

        if (data === '') {
          dispatch('LOCATION_REPLACE', '/')
        } else {
          const url = '/search?' + querystring.encode({ q: data })
          dispatch(
            store.location.name === 'search' ? 'LOCATION_REPLACE' : 'LOCATION_PUSH',
            url
          )
        }
        return
      }

      /**
       * PENDING DISPATCH
       */

      case 'RUN_PENDING_DISPATCH': {
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
    store.midis[midi.id] = midi
  }

  // function addSearch (search) {
  //   store.searches[search.q] = search
  // }

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

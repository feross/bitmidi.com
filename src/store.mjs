'use strict'

import Debug from 'debug'

import api from './api'
import { siteName, description, siteImage, isBrowser } from './config'
import Location from './lib/location'
import routes from './routes'
import * as player from './browser/player'

const debug = Debug('bitmidi:store')
const debugVerbose = Debug('bitmidi:store:verbose')

const DEBUG_VERBOSE = new Set([
  'APP_RESIZE'
])

export default function createStore (render, onPendingChange = () => {}) {
  const store = {
    location: {
      name: null,
      url: null,
      params: {},
      query: {},
      canonicalUrl: null
    },

    app: {
      title: null, // Page title
      description: null, // Page meta description
      image: null, // Page image
      isLoaded: false, // Did window.onload() fire?
      pending: 0
    },

    fatalError: null,
    errors: [],

    player: {
      current: null
    },

    // local data
    data: {
      midis: {} // midi.slug -> midi
    },

    views: {
      search: {}, // 'query' -> { total: 0, pageTotal: 0, '0': ['slug'] } }
      all: {}
    }
  }

  const loc = new Location(routes, (location, source) => {
    dispatch('LOCATION_CHANGED', { location, source })
  })

  function incrementPending () {
    store.app.pending += 1
    update()
    onPendingChange()
  }

  function decrementPending () {
    store.app.pending -= 1
    update()
    onPendingChange()
  }

  async function dispatch (typeOrThunk, data) {
    try {
      if (typeof typeOrThunk === 'function') {
        incrementPending()
        const ret = await typeOrThunk(dispatch)
        decrementPending()
        return ret
      } else {
        await _dispatch(typeOrThunk, data)
      }
    } catch (err) {
      addError(err)
      if (typeof typeOrThunk === 'function') decrementPending()
      update()
    }
  }

  async function _dispatch (type, data) {
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

        if (isBrowser) {
          if (source === 'push') window.scroll(0, 0)
          window.ga('send', 'pageview', location.url)
        }
        return update()
      }

      /**
       * APP
       */

      case 'APP_META': {
        const title = typeof data.title === 'string'
          ? [data.title]
          : Array.isArray(data.title)
            ? [...data.title]
            : []
        title.push(siteName)

        store.app.title = title.map(str => str.trim()).join(' — ')

        store.app.description = data.description != null
          ? data.description.trim()
          : description

        store.app.image = data.image || siteImage

        return update()
      }

      case 'APP_IS_LOADED': {
        store.app.isLoaded = true
        return update()
      }

      case 'APP_SHARE': {
        if (navigator.share == null) return
        await navigator.share({
          title: store.app.title,
          url: store.location.canonicalUrl
        })
        window.ga('send', 'event', 'share', 'navigator.share')
        return
      }

      /**
       * MIDI
       */

      case 'MIDI_GET_START': return
      case 'MIDI_GET_DONE': {
        const { result } = data
        addMidi(result)
        return update()
      }

      case 'MIDI_ALL_START': return
      case 'MIDI_ALL_DONE': {
        const { query, total, pageTotal, results } = data
        const { views } = store

        results.map(addMidi)
        views.all.total = total
        views.all.pageTotal = pageTotal
        views.all[query.page] = results.map(midi => midi.slug)
        return update()
      }

      case 'MIDI_SEARCH_START': return
      case 'MIDI_SEARCH_DONE': {
        const { query, total, pageTotal, results } = data
        const { views } = store

        results.map(addMidi)
        if (!views.search[query.q]) views.search[query.q] = {}
        views.search[query.q].total = total
        views.search[query.q].pageTotal = pageTotal
        views.search[query.q][query.page] = results.map(midi => midi.slug)
        return update()
      }

      case 'MIDI_RANDOM_START': return
      case 'MIDI_RANDOM_DONE': {
        const { result } = data
        addMidi(result)
        dispatch('LOCATION_REPLACE', result.url)
        return
      }

      case 'MIDI_PLAY_PAUSE': {
        const midiSlug = data
        const midi = store.data.midis[midiSlug]

        if (store.player.currentSlug === midiSlug) {
          player.pause()
          store.player.currentSlug = null
        } else {
          player.load(midi.downloadUrl)
          player.play()
          store.player.currentSlug = midiSlug
        }

        api.midi.play({ slug: midiSlug }) // Track play count
        midi.plays += 1 // Optimistically update local play count

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
          const url = `/search?${new URLSearchParams({ q: data })}`
          dispatch(
            store.location.name === 'search'
              ? 'LOCATION_REPLACE'
              : 'LOCATION_PUSH',
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

  let isUpdating = false
  let isUpdatePending = false

  function update () {
    // Prevent infinite recursion when dispatch() is called during an update()
    if (isUpdating) {
      isUpdatePending = true
      return
    }
    debugVerbose('update')

    isUpdating = true
    render()
    isUpdating = false

    const needUpdate = isUpdatePending
    isUpdatePending = false
    if (needUpdate) update()
  }

  return {
    store,
    dispatch
  }
}

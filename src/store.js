'use strict'

import Debug from 'debug'
import Timidity from 'timidity'

import api from './api'
import { siteName, siteDesc, siteImage, isBrowser } from './config'
import Location from './lib/location'
import routes from './routes'

const debug = Debug('bitmidi:store')
const debugVerbose = Debug('bitmidi:store:verbose')

const DEBUG_VERBOSE = new Set([
  'APP_RESIZE'
])

let player = null

export default function createStore (_update, onPendingChange = () => {}) {
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
      meta: {}, // Custom meta tags

      isLoaded: false, // Did window.onload() fire?
      isServerRendered: false, // Was the current page server rendered?
      pending: 0, // How many outstanding load requests?
      colorScheme: 'light' // Browser color scheme
    },

    fatalError: false,
    errors: [],

    player: {
      current: null,
      lastAutoplay: Date.now() // time of last autoplay (Date.now() format)
    },

    // local data
    data: {
      midis: {} // midi.slug -> midi
    },

    views: {
      related: {}, // 'slug' -> ['slug']
      search: {}, // 'query' -> { total: 0, pageTotal: 0, '0': ['slug'] } }
      all: {} // { total: 0, pageTotal: 0, '0': ['slug' ] }
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
    const thunk = typeof typeOrThunk === 'function' ? typeOrThunk : null
    const type = typeof typeOrThunk === 'string' ? typeOrThunk : null
    try {
      if (thunk != null) {
        incrementPending()
        const ret = await thunk(dispatch)
        decrementPending()
        return ret
      } else if (type != null) {
        await _dispatch(type, data)
      }
    } catch (err) {
      const { message, stack, code = null, status = null } = err
      _dispatch('ERROR_FATAL', { message, stack, code, status })
      if (thunk != null) decrementPending()
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

        if (source !== 'replace') {
          // On page navigation, clear certain flags
          store.fatalError = false
          store.app.isServerRendered = false
        }

        if (isBrowser) {
          if (source === 'push') window.scroll(0, 0)
          window.ga('send', 'pageview', location.url)
          window.qc()
        }
        return update()
      }

      case 'ERROR_FATAL': {
        const error = data
        store.errors.push(error)
        if (isBrowser) console.error(error.stack)
        store.fatalError = true
        return update()
      }

      case 'ERROR': {
        const error = data
        store.errors.push(error)
        if (isBrowser) console.error(error.stack)
        return update()
      }

      /**
       * APP
       */

      case 'APP_META': {
        const parse = input => typeof input === 'string'
          ? [input]
          : Array.isArray(input)
            ? [...input]
            : []

        const format = arr => arr.map(str => str.trim()).join(' — ')

        store.app.title = format([...parse(data.title), siteName])

        const description = format(parse(data.description))

        // If description is too short, include site description at end
        store.app.description = description.length >= 50
          ? description
          : format([...parse(data.description), siteDesc])

        store.app.image = data.image || siteImage

        store.app.meta = data.meta != null
          ? { ...data.meta }
          : {}

        return update()
      }

      case 'APP_IS_LOADED': {
        store.app.isLoaded = true
        return update()
      }

      case 'APP_SHARE': {
        if (navigator.share == null) return
        try {
          await navigator.share({
            title: store.app.title,
            url: store.location.canonicalUrl
          })
          window.ga('send', 'event', 'share', 'navigator.share')
        } catch {}
        return
      }

      case 'APP_COLOR_SCHEME': {
        store.app.colorScheme = data
        return update()
      }

      /**
       * MIDI
       */

      case 'MIDI_GET_START': return
      case 'MIDI_GET_DONE': {
        const { result, related } = data
        const { views } = store

        addMidi(result)
        if (related) {
          related.map(addMidi)
          views.related[result.slug] = related.map(midi => midi.slug)
        }
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
          getPlayerInstance().pause()
          store.player.currentSlug = null
        } else {
          getPlayerInstance().load(midi.downloadUrl)
          getPlayerInstance().play()

          store.player.currentSlug = midiSlug

          // Track play count
          api.midi.play({ slug: midiSlug })
          midi.plays += 1 // Optimistically update local count
        }

        return update()
      }

      case 'MIDI_PLAY_BUFFER': {
        const buf = data
        getPlayerInstance().load(buf)
        getPlayerInstance().play()
        store.player.currentSlug = null
        return update()
      }

      case 'MIDI_ENDED': {
        const AUTOPLAY_MIN_TIMEOUT = 1 * 60 * 1000 // 1 minute

        const { currentSlug } = store.player
        const { location, player, views } = store

        if (currentSlug != null) {
          const related = views.related[currentSlug]
          const nextMidiSlug =
            related[Math.floor(Math.random() * related.length)]

          // Try to autoplay
          if (nextMidiSlug && location.name === 'midi' &&
              location.params.midiSlug === currentSlug) {
            const timeSinceLastAutoplay = Date.now() - player.lastAutoplay
            if (timeSinceLastAutoplay >= AUTOPLAY_MIN_TIMEOUT) {
              player.lastAutoplay = Date.now()
              dispatch('LOCATION_PUSH', `/${nextMidiSlug}`)
              dispatch('MIDI_PLAY_PAUSE', nextMidiSlug)
            } else {
              // Wait at least AUTOPLAY_MIN_TIMEOUT between autoplays
              setTimeout(
                () => dispatch('MIDI_ENDED'),
                AUTOPLAY_MIN_TIMEOUT - timeSinceLastAutoplay
              )
            }
          } else {
            store.player.currentSlug = null
          }
        }

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
        } catch {}

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

  function addMidi (midi) {
    store.data.midis[midi.slug] = midi
  }

  function getPlayerInstance () {
    if (!player) {
      player = new Timidity('/timidity')
      player.on('unstarted', () => console.log('unstarted'))
      player.on('playing', () => console.log('playing'))
      player.on('paused', () => console.log('paused'))
      player.on('ended', () => {
        console.log('ended')
        dispatch('MIDI_ENDED')
      })
      player.on('buffering', () => console.log('buffering'))
      player.on('timeupdate', (time) => console.log('timeupdate', time))
      player.on('error', (err) => console.log('error', err))
    }
    return player
  }

  let isUpdating = false
  let isUpdatePending = false

  function update () {
    // Prevent infinite recursion when dispatch() is called during an update()
    if (isUpdating) {
      isUpdatePending = true
      return
    }
    // debugVerbose('update')

    isUpdating = true
    _update()
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

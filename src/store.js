'use strict'

module.exports = createStore

const copy = require('clipboard-copy')
const debug = require('debug')('nodefoo:store')
const debugVerbose = require('debug')('nodefoo:store:verbose')
const querystring = require('querystring')

const api = require('./api')
const config = require('../config')
const Location = require('./lib/location')
const routes = require('./routes')

const DEBUG_VERBOSE = new Set([
  'APP_RESIZE'
])

function createStore (render, onFetchDone) {
  const store = {
    location: {
      name: null,
      params: {},
      url: null,
      query: {},
      pathname: null
    },

    app: {
      title: null,
      width: 0,
      height: 0,
      isLoaded: false, // did window.onload() fire?
      fetchCount: 0
    },

    fatalError: null,
    errors: [],
    userName: null,

    // local database
    snippets: {}, // snippet.id -> snippet
    searches: {}, // search.q -> search

    // data views
    topSnippetIds: null, // [ snippet.id ]

    // TODO
    doc: null
  }

  const loc = new Location(routes, (location, source) => {
    dispatch('LOCATION_CHANGED', { location, source })
  })

  function dispatch (type, data) {
    if (DEBUG_VERBOSE.has(type)) debugVerbose('%s %o', type, data)
    else debug('%s %o', type, data)

    // Reference counter for pending fetches
    if (type.startsWith('API_')) {
      if (type.endsWith('_DONE')) {
        store.app.fetchCount -= 1
        if (typeof onFetchDone === 'function') onFetchDone()
      } else {
        store.app.fetchCount += 1
      }
    }

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

      case 'APP_TITLE': {
        const title = data ? data + ' – ' + config.name : config.name
        store.app.title = title
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
       * DOC
       */

      case 'API_DOC': {
        api.doc.get(data, (err, doc) => {
          dispatch('API_DOC_DONE', { err, doc })
        })
        return update()
      }

      case 'API_DOC_DONE': {
        const { err, doc } = data
        if (err) return addError(err)
        store.doc = doc
        return update()
      }

      /**
       * SNIPPET
       */

      case 'API_SNIPPET_ADD': {
        if (store.userName == null) {
          addPendingDispatch(type, data)
          addError(
            new Error('Last step! Log in to get credit for your contribution.')
          )
          window.location.href = '/auth/twitter'
          return
        }
        api.snippet.add(data, (err, result) => {
          dispatch('API_SNIPPET_ADD_DONE', { err, result })
        })
        return update()
      }

      case 'API_SNIPPET_ADD_DONE': {
        const { err } = data
        if (err) return addError(err)
        dispatch('LOCATION_PUSH', '/')
        return update()
      }

      case 'API_SNIPPET_VOTE': {
        api.snippet.vote(data, (err, snippet) => {
          dispatch('API_SNIPPET_VOTE_DONE', { err, snippet })
        })
        return update()
      }

      case 'API_SNIPPET_VOTE_DONE': {
        const { err, snippet } = data
        if (err) return addError(err)
        addSnippet(snippet)
        return update()
      }

      case 'API_SNIPPET_GET': {
        api.snippet.get(data, (err, snippet) => {
          dispatch('API_SNIPPET_GET_DONE', { err, snippet })
        })
        return update()
      }

      case 'API_SNIPPET_GET_DONE': {
        const { err, snippet } = data
        if (err) return addError(err)

        addSnippet(snippet)
        return update()
      }

      case 'API_SNIPPET_ALL': {
        api.snippet.all(data, (err, snippets) => {
          dispatch('API_SNIPPET_ALL_DONE', { err, snippets })
        })
        return update()
      }

      case 'API_SNIPPET_ALL_DONE': {
        const { err, snippets } = data
        if (err) return addError(err)

        snippets.map(addSnippet)
        store.topSnippetIds = snippets.map(snippet => snippet.id)
        return update()
      }

      case 'API_SNIPPET_SEARCH': {
        api.snippet.search(data, (err, search) => {
          dispatch('API_SNIPPET_SEARCH_DONE', { err, search })
        })
        return update()
      }

      case 'API_SNIPPET_SEARCH_DONE': {
        const { err, search } = data
        if (err) return addError(err)
        addSearch(search)
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
       * CLIPBOARD
       */

      case 'CLIPBOARD_COPY': {
        copy(data)
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

  function addPendingDispatch (type, data) {
    window.localStorage.pendingDispatch = JSON.stringify({ type, data })
  }

  function addError (err) {
    const { message, code = null, stack } = err
    store.errors.push({ message, code })
    console.error(stack)
    update()
  }

  function addSnippet (snippet) {
    store.snippets[snippet.id] = snippet
  }

  function addSearch (search) {
    store.searches[search.q] = search
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

    if (isUpdatePending) {
      isUpdatePending = false
      update()
    }
  }

  return {
    store,
    dispatch
  }
}

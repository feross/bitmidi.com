import Router from 'express-promise-router'

import api from '../api'
import { origin, isProd } from '../config'
import createRenderer from '../lib/preact-dom-renderer'
import createStore from '../store'
import getProvider from '../views/provider'

const router = Router()

// TODO: remove this once Google indexes the new /:midiSlug URLs
// Redirect from /1 to /009count-mid
router.get('/:midiId(\\d+)', async (req, res, next) => {
  const midiId = Number(req.params.midiId)
  if (midiId === 500) return next()
  const { result } = await api.midi.get({ id: midiId })
  res.redirect(301, `${origin}${result.url}`)
})

router.use((req, res, next) => {
  const renderer = createRenderer()
  const { store, dispatch } = createStore(update, onPendingChange)
  const jsx = getProvider(store, dispatch)

  // For debugging – Disable SSR to debug JSX in the browser rather than Node
  if (!isProd && req.query.ssr === '0') {
    return res.render('layout', { content: '', store })
  }

  if (req.err) {
    const { message, stack, code = null, status = null } = req.err
    dispatch('ERROR_FATAL', { message, stack, code, status })
  }
  dispatch('LOCATION_REPLACE', req.url)
  const routeName = store.location.name

  onPendingChange()

  function onPendingChange () {
    if (store.app.pending === 0) process.nextTick(done)
  }

  function update () {
    renderer.render(jsx)
  }

  function done () {
    if (req.err != null) {
      // Fatal error occurred, send page and ignore any render errors
      return sendPage(Number(req.err.status) || 500)
    } else if (store.errors[0] != null) {
      // Render errors are treated as fatal during server render
      const err = new Error(store.errors[0].message)
      Object.assign(err, store.errors[0])
      return next(err)
    } else if (store.location.name === 'error') {
      // Request did not match any routes
      return sendPage(404)
    } else if (routeName !== store.location.name) {
      // Location changes are treated as redirects during server render
      return res.redirect(307, store.location.canonicalUrl)
    } else {
      // Happy path! No errors, rendered successfully!
      return sendPage(200)
    }

    function sendPage (status) {
      store.errors.map(err => { delete err.stack })
      res
        .status(status)
        .render('layout', { content: renderer.html(), store })
    }
  }
})

export default router

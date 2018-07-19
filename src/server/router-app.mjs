import Router from 'express-promise-router'

import api from '../api'
import config from '../../config'
import createRenderer from '../lib/preact-dom-renderer'
import createStore from '../store'
import getProvider from '../views/provider'

const router = Router()

// Redirect from /1 to /009count-mid
// TODO: remove this once Google indexes the new /:midiSlug URLs
router.get('/:midiId(\\d+)', async (req, res, next) => {
  const midiId = Number(req.params.midiId)
  if (midiId === 500) return next()

  const { result } = await api.midi.get({ id: midiId })
  res.redirect(301, `${config.httpOrigin}${result.url}`)
})

router.use(async (req, res) => {
  const renderer = createRenderer()
  const { store, dispatch } = createStore(update, onPendingChange)
  const jsx = getProvider(store, dispatch)

  // Useful for debugging JSX issues in the browser instead of Node
  if (!config.isProd && req.query.ssr === '0') {
    res.render('layout', {
      content: '',
      store,
      canonicalUrl: ''
    })
    return
  }

  dispatch('LOCATION_REPLACE', req.url)
  onPendingChange()

  function onPendingChange () {
    if (store.app.pending === 0) process.nextTick(done)
  }

  function update () {
    renderer.render(jsx)
  }

  function done () {
    if (req.err) {
      const { message, stack, code = null, status = 500 } = req.err
      store.fatalError = { message, code, status }
      console.error(stack)
      update()
    } else if (store.errors.length > 0) {
      // When an error occurs during server rendering, treat it as a fatal error
      const { message, stack, code = null, status = 404 } = store.errors.shift()
      store.fatalError = { message, code, status }
      console.error(stack)
      update()
    }

    let status = 200

    if (store.fatalError) {
      status = typeof store.fatalError.status === 'number'
        ? store.fatalError.status
        : 500
    } else if (store.location.name === 'error') {
      status = 404
    }

    res.status(status)
    res.render('layout', {
      content: renderer.html(),
      store,
      canonicalUrl: `${config.httpOrigin}${store.location.canonicalUrl}`
    })
  }
})

export default router

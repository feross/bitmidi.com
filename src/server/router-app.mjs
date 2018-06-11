import Router from 'express-promise-router'

import config from '../../config'
import createRenderer from '../lib/preact-dom-renderer'
import createStore from '../store'
import getProvider from '../views/provider'

const router = Router()

router.use(async (req, res) => {
  const renderer = createRenderer()
  const { store, dispatch } = createStore(update, onPendingChange)
  const jsx = getProvider(store, dispatch)

  // Useful for debugging JSX issues in the browser instead of Node
  if (!config.isProd && req.query.ssr === '0') {
    return res.render('app', { content: '', store, url: req.url })
  }

  store.userName = (req.session.user && req.session.user.userName) || null

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
      const { message, code = null, status = 500, stack } = req.err
      store.fatalError = { message, code, status }
      console.error(stack)
      update()
    } else if (store.errors.length > 0) {
      // When an error occurs during server rendering, treat it as a fatal error
      const { message, code = null, status = 404 } = store.errors.shift()
      store.fatalError = { message, code, status }
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
    res.render('app', {
      content: renderer.html(),
      store,
      url: req.url
    })
  }
})

export default router

const { h } = require('preact') /** @jsx h */

const express = require('express')
const Provider = require('preact-context-provider')

const createRenderer = require('../lib/preact-dom-renderer')
const createStore = require('../store')

const App = require('../views/app')

const router = express.Router()

// Render all routes on the server
router.get('*', (req, res) => handleRender(null, req, res))

// Log errors to Opbeat
if (global.opbeat) router.use(global.opbeat.middleware.express())

// Handle errors with the same server-side rendering path
router.use((err, req, res, next) => handleRender(err, req, res))

function handleRender (err, req, res) {
  const renderer = createRenderer()
  const { store, dispatch } = createStore(update, onFetchEnd)

  if (err) {
    console.error(err.stack)
    store.errors.push(err.message)
  }

  store.userName = (req.session.user && req.session.user.userName) || null

  const jsx = (
    <Provider store={store} dispatch={dispatch}>
      <App />
    </Provider>
  )

  dispatch('LOCATION_REPLACE', req.url)

  if (store.app.fetchCount === 0) done()

  function onFetchEnd () {
    if (store.app.fetchCount === 0) process.nextTick(done)
  }

  function update () {
    renderer.render(jsx)
  }

  function done () {
    const { location, errors } = store

    let status = 200

    if (err) {
      status = typeof err.status === 'number' ? err.status : 500 // Internal Server Error
    } else if (location.name === 'not-found' || errors.length > 0) {
      status = 404
    }

    res.status(status)

    const content = renderer.html()
    res.render('index', { content, store, title: store.app.title })
  }
}

module.exports = router

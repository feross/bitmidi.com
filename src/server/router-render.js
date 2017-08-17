const express = require('express')
const { h } = require('preact') /** @jsx h */
const Provider = require('preact-context-provider')
// const render = require('preact-render-to-string')

const createRenderer = require('../lib/preact-dom-renderer')
const createStore = require('../store')

const App = require('../views/app')

const router = express.Router()

router.get('*', (req, res) => {
  const renderer = createRenderer()
  const { store, dispatch } = createStore(update, onFetchEnd)
  const { app, location } = store

  const jsx = (
    <Provider store={store} dispatch={dispatch}>
      <App />
    </Provider>
  )

  dispatch('LOCATION_REPLACE', req.url)

  if (store.fetchCount === 0) done()

  function onFetchEnd () {
    if (store.fetchCount === 0) process.nextTick(done)
  }

  function update () {
    renderer.render(jsx)
  }

  function done () {
    const status = location.name === 'not-found' ? 404 : 200
    res.status(status)

    const content = renderer.html()
    res.render('index', { content, title: app.title })
  }
})

module.exports = router

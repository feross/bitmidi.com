const express = require('express')
const { h } = require('preact') /** @jsx h */
const Provider = require('preact-context-provider')
const render = require('preact-render-to-string')

const routes = require('../routes')
const store = require('../store')

const App = require('../views/app')

const routerRender = express.Router()

routerRender.get('*', (req, res) => {
  const { app, location } = store

  store.dispatch('LOCATION_REPLACE', req.url)
  console.log(req.url, location)
  const Page = routes.find(route => route[0] === location.name)[2]
  console.log(Page)

  if (typeof Page.prototype === 'function' &&
      typeof Page.prototype.load === 'function') {
    Page.prototype.load.call({ context: { store } })
  }

  const jsx = (
    <Provider store={store}>
      <App />
    </Provider>
  )

  const content = render(jsx)

  const status = location.name === 'not-found' ? 404 : 200
  res.status(status)
  res.render('index', { content, title: app.title })
})

module.exports = routerRender

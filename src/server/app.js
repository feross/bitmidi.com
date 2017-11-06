module.exports = {
  init
}

const compress = require('compression')
const crypto = require('crypto')
const express = require('express')
const fs = require('fs')
const path = require('path')
const session = require('express-session')

const config = require('../../config')
const createRenderer = require('../lib/preact-dom-renderer')
const createStore = require('../store')
const getProvider = require('../views/provider')
const routerApi = require('./router-api')
const routerLogin = require('./router-login')
const secret = require('../../secret')

function init (sessionStore) {
  const app = express()

  // Set up templating
  app.set('view engine', 'ejs')
  app.set('views', path.join(config.rootPath, 'src'))

  app.set('trust proxy', true) // Trust the nginx reverse proxy
  app.set('json spaces', config.isProd ? 0 : 2) // Pretty-print JSON in development
  app.set('x-powered-by', false) // Prevent server fingerprinting

  app.use(compress()) // Compress http responses with gzip

  // Add headers
  app.use((req, res, next) => {
    // Disable browser mime-type sniffing to reduce exposure to drive-by download
    // attacks when serving user uploaded content
    res.header('X-Content-Type-Options', 'nosniff')

    // Prevent rendering of site within a frame
    res.header('X-Frame-Options', 'DENY')

    // Enable browser XSS filtering. Usually enabled by default, but this header re-
    // enables it if it was disabled by the user, and asks the the browser to prevent
    // rendering of the page if an attack is detected.
    res.header('X-XSS-Protection', '1; mode=block')

    if (config.isProd) {
      // Redirect to main site url, over https
      if (req.method === 'GET' &&
          (req.protocol !== 'https' || req.hostname !== config.host)) {
        return res.redirect(301, config.httpOrigin + req.url)
      }

      // Use HSTS (cache for 2 years, include subdomains, allow browser preload list)
      res.header(
        'Strict-Transport-Security',
        'max-age=63072000; includeSubDomains; preload'
      )
    }

    next()
  })

  // Set up static file serving
  const staticOpts = { maxAge: config.maxAge }

  app.use(express.static(path.join(config.rootPath, 'static'), staticOpts))

  // Set up session handling
  app.use(session({
    store: sessionStore,
    secret: secret.cookie,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    cookie: {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      secure: config.isProd
    }
  }))

  const styleHash = config.isProd
    ? createHash(fs.readFileSync(path.join(config.rootPath, 'static', 'bundle.css')))
    : 'development'

  const scriptHash = config.isProd
    ? createHash(fs.readFileSync(path.join(config.rootPath, 'static', 'bundle.js')))
    : 'development'

  // Add template local variables
  app.use((req, res, next) => {
    res.locals.config = config
    res.locals.styleHash = styleHash
    res.locals.scriptHash = scriptHash
    next()
  })

  app.get('/500', (req, res, next) => {
    next(new Error('Manually visited /500'))
  })

  app.use('/api', routerApi)
  app.use('/auth', routerLogin)

  // Render all routes on the server
  app.get('*', (req, res) => handleRender(null, req, res))

  // Log errors to Opbeat
  if (global.opbeat) app.use(global.opbeat.middleware.express())

  // Handle errors with the same server-side rendering path
  app.use((err, req, res, next) => handleRender(err, req, res))

  return app
}

function handleRender (err, req, res) {
  const renderer = createRenderer()
  const { store, dispatch } = createStore(update, onFetchDone)
  const jsx = getProvider(store, dispatch)

  store.userName = (req.session.user && req.session.user.userName) || null

  dispatch('LOCATION_REPLACE', req.url)
  if (store.app.fetchCount === 0) done()

  function onFetchDone () {
    if (store.app.fetchCount === 0) process.nextTick(done)
  }

  function update () {
    renderer.render(jsx)
  }

  function done () {
    if (err) {
      const { message, code = null, status = 500, stack } = err
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
    res.render('index', {
      content: renderer.html(),
      store,
    })
  }
}

// Create a cache-busting hash for static assets like `bundle.js` and `bundle.css`
function createHash (data) {
  return crypto.createHash('sha256')
    .update(data)
    .digest('base64')
    .slice(0, 20)
    .replace(/\+|\/|=/g, '')
}

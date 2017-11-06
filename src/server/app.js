module.exports = {
  init
}

const crypto = require('crypto')
const express = require('express')
const fs = require('fs')
const path = require('path')
const session = require('express-session')
const uuid = require('uuid/v4')

const config = require('../../config')
const createRenderer = require('../lib/preact-dom-renderer')
const createStore = require('../store')
const getProvider = require('../views/provider')
const secret = require('../../secret')
const { oneLine } = require('common-tags')

const routerApi = require('./router-api')
const routerAuth = require('./router-auth')
const routerFeed = require('./router-feed')

function init (sessionStore) {
  const app = express()

  app.set('view engine', 'ejs') // Use EJS for server-side templating
  app.set('views', path.join(config.rootPath, 'src', 'server')) // Template folder

  app.set('trust proxy', true) // Trust the nginx reverse proxy
  app.set('json spaces', config.isProd ? 0 : 2) // Pretty-print JSON in development
  app.set('x-powered-by', false) // Prevent server fingerprinting

  app.use((req, res, next) => {
    // Redirect to canonical origin, over https
    if (config.isProd && req.method === 'GET' &&
        (req.protocol !== 'https' || req.hostname !== config.host)) {
      return res.redirect(301, config.httpOrigin + req.url)
    }

    // Disable browser mime-type sniffing to reduce exposure to drive-by download
    // attacks when serving user uploaded content
    res.header('X-Content-Type-Options', 'nosniff')

    // Use HSTS (cache for 2 years, include subdomains, allow browser preload)
    if (config.isProd) {
      res.header(
        'Strict-Transport-Security',
        'max-age=63072000; includeSubDomains; preload'
      )
    }

    next()
  })

  // Set up static file serving
  app.use(
    express.static(path.join(config.rootPath, 'static'), { maxAge: config.maxAge })
  )

  const styleHash = config.isProd
    ? createHash(fs.readFileSync(path.join(config.rootPath, 'static', 'bundle.css')))
    : 'dev'

  const scriptHash = config.isProd
    ? createHash(fs.readFileSync(path.join(config.rootPath, 'static', 'bundle.js')))
    : 'dev'

  // Add template variables and headers for dynamic content
  app.use((req, res, next) => {
    // Add template local variables
    res.locals.config = config
    res.locals.styleHash = styleHash
    res.locals.scriptHash = scriptHash
    res.locals.nonce = uuid()

    // Prevent rendering of site within a frame
    res.header('X-Frame-Options', 'DENY')

    // Enable browser XSS filtering. Usually enabled by default, but this header re-
    // enables it if it was disabled by the user, and asks the the browser to prevent
    // rendering of the page if an attack is detected.
    res.header('X-XSS-Protection', '1; mode=block')

    // Prevent XSS attacks by specifying valid sources of executable scripts, etc.
    res.header('Content-Security-Policy', oneLine`
      default-src
        'none'
      ;
      connect-src
        'self'
      ;
      img-src
        'self'
        https://pbs.twimg.com
        https://www.google-analytics.com
      ;
      script-src
        'self'
        'nonce-${res.locals.nonce}'
        https://www.google-analytics.com
        data:
      ;
      style-src
        'self'
        'unsafe-inline'
      ;
    `)

    next()
  })

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

  app.get('/500', (req, res, next) => {
    next(new Error('Manually visited /500'))
  })

  app.use('/api', routerApi)
  app.use('/auth', routerAuth)
  app.use(routerFeed)

  // Render all routes on the server
  app.get('*', (req, res) => renderApp(null, req, res))

  // Log errors to Opbeat
  if (global.opbeat) app.use(global.opbeat.middleware.express())

  // Handle errors with the same server-side rendering path
  app.use(renderApp)

  return app
}

function renderApp (err, req, res) {
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
    res.render('app', {
      content: renderer.html(),
      store,
      url: req.url
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

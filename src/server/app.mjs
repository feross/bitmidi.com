import crypto from 'crypto'
import express from 'express'
import fs from 'fs'
import path from 'path'
import session from 'express-session'
import uuid from 'uuid/v4'
import { oneLine } from 'common-tags'

import config from '../../config'
import createRenderer from '../lib/preact-dom-renderer'
import createStore from '../store'
import getProvider from '../views/provider'
import { cookie as cookieSecret } from '../../secret'

import routerApi from './router-api'
import routerFeed from './router-feed'

export default function init (sessionStore) {
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

    // Prevent information leaks through the 'Referer' header. Only send a full URL
    // for same-origin requests, only send the document origin when navigating
    // HTTPS->HTTPS, and send no header when navigating HTTPS->HTTP.
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Use HTTP Strict Transport Security (HSTS), cached for 2 years, including on
    // subdomains, and allow browser preload.
    if (config.isProd) {
      res.header(
        'Strict-Transport-Security',
        `max-age=${config.maxAgeHSTS / 1000}; includeSubDomains; preload`
      )
    }

    next()
  })

  // Set up static file serving
  const staticPath = path.join(config.rootPath, 'static')
  const uploadsPath = path.join(config.rootPath, 'uploads')
  app.use(express.static(staticPath, { maxAge: config.maxAgeStatic }))
  app.use('/uploads', express.static(uploadsPath, { maxAge: config.maxAgeStatic }))

  // Compute hashes for built resources
  const styleHash = config.isProd
    ? createHash(fs.readFileSync(path.join(staticPath, 'bundle.css')))
    : 'dev'

  const scriptHash = config.isProd
    ? createHash(fs.readFileSync(path.join(staticPath, 'bundle.js')))
    : 'dev'

  app.use((req, res, next) => {
    // Add template local variables
    res.locals.config = config
    res.locals.styleHash = styleHash
    res.locals.scriptHash = scriptHash
    res.locals.nonce = Buffer.from(uuid()).toString('base64')

    next()
  })

  // Set up session handling
  app.use(session({
    store: sessionStore,
    secret: cookieSecret,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    cookie: {
      httpOnly: true, // Prevent cookies from being accessed by client JavaScript
      maxAge: config.maxAgeCookie, // Time to keep cookies before deletion
      sameSite: 'lax', // Prevent cookies from being sent with cross-site requests
      secure: config.isProd // Prevent cookies from being sent over insecure HTTP
    }
  }))

  app.use('/api', routerApi)
  app.use(routerFeed)

  app.use((req, res, next) => {
    // Enable browser XSS filtering. Usually enabled by default, but this header re-
    // enables it if it was disabled by the user, and asks the the browser to prevent
    // rendering of the page if an attack is detected.
    res.header('X-XSS-Protection', '1; mode=block')

    // Prevent XSS attacks by specifying valid sources of executable scripts, etc.
    res.header('Content-Security-Policy', oneLine`
      base-uri
        'none'
      ;
      frame-ancestors
        'none'
      ;
      default-src
        'none'
      ;
      connect-src
        'self'
        http://www.midijs.net
      ;
      img-src
        'self'
        https://pbs.twimg.com
        https://www.google-analytics.com
      ;
      manifest-src
        'self'
      ;
      script-src
        'strict-dynamic' https:
        'nonce-${res.locals.nonce}' 'unsafe-inline'
      ;
      style-src
        'self'
        'unsafe-inline'
      ;
      worker-src
        'self'
      ;
    `)

    next()
  })

  app.get('/500', (req, res, next) => {
    next(new Error('Manually visited /500'))
  })

  // Render all routes on the server
  app.get('*', (req, res) => renderApp(null, req, res))

  // Log errors to Opbeat
  if (global.opbeat) app.use(global.opbeat.middleware.express())

  // Handle errors with the same server-side rendering path
  app.use(renderApp)

  return app
}

// TODO: consider moving to its own file: router-app.mjs
function renderApp (err, req, res) {
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

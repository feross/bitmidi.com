import crypto from 'crypto'
import express from 'express'
import favicon from 'serve-favicon'
import morgan from 'morgan'
import MySQLSession from 'express-mysql-session'
import oneLine from 'common-tags/lib/oneLine'
import session from 'express-session'
import uuid from 'uuid/v4'
import { join, dirname } from 'path'
import { readFileSync } from 'fs'

import * as config from '../config'
import { cookie as cookieSecret, db as dbSecret } from '../../secret'

import routerApi from './router-api'
import routerFeed from './router-feed'
import routerRender from './router-render'

// Set correct mime-type for streaming wasm compilation
// See: https://github.com/expressjs/express/issues/3589
// TODO: Remove when express 4.17.0 is released
express.static.mime.types['wasm'] = 'application/wasm'

// Set correct mime type for .pat (Gravis Ultrasound) files
express.static.mime.types['pat'] = 'audio/pat'

const MySQLStore = MySQLSession(session)

export default function init () {
  const app = express()

  // Use EJS for server-side templating
  app.set('view engine', 'ejs')
  app.set('views', join(config.rootPath, 'src', 'server'))

  app.set('trust proxy', true) // Trust the nginx reverse proxy
  app.set('json spaces', config.isProd ? 0 : 2) // Pretty JSON (in dev)
  app.set('x-powered-by', false) // Prevent server fingerprinting

  // Headers to send with all responses
  app.use((req, res, next) => {
    // Redirect to canonical origin, over https
    if (config.isProd && req.method === 'GET' &&
        (req.protocol !== 'https' || req.hostname !== config.host)) {
      return res.redirect(301, config.origin + req.url)
    }

    // Disable browser mime-type sniffing to reduce exposure to drive-by
    // download attacks when serving user uploaded content
    res.header('X-Content-Type-Options', 'nosniff')

    // Prevent information leaks through the 'Referer' header. For same-
    // origin requests, send a full URL. For cross-origin HTTPS->HTTPS
    // navigation, send the document origin. For cross-origin HTTPS->HTTP
    // navigation, send nothing.
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Use HTTP Strict Transport Security (HSTS), cached for 2 years,
    // including on subdomains, and allow browser preload.
    if (config.isProd) {
      res.header(
        'Strict-Transport-Security',
        `max-age=${config.maxAgeHSTS / 1000}; includeSubDomains; preload`
      )
    }

    next()
  })

  // Serve favicon
  app.use(favicon(join(config.rootPath, 'static', 'favicon.ico'), {
    maxAge: config.maxAgeStatic
  }))

  // Serve static files
  const staticPath = join(config.rootPath, 'static')
  app.use(serveStatic(staticPath))

  const iconsPath = join(
    dirname(require.resolve('material-design-icons')),
    'iconfont'
  )
  app.use(serveStatic(iconsPath))

  const timidityPath = dirname(require.resolve('timidity'))
  app.use('/timidity', serveStatic(timidityPath))

  const freepatsPath = dirname(require.resolve('freepats'))
  app.use('/timidity', serveStatic(freepatsPath))

  const uploadsPath = join(config.rootPath, 'uploads')
  app.use('/uploads', serveStatic(uploadsPath))

  // Compute hashes for built resources
  const styleHash = config.isProd
    ? createHash(readFileSync(join(staticPath, 'bundle.css')))
    : 'dev'

  const scriptHash = config.isProd
    ? createHash(readFileSync(join(staticPath, 'bundle.js')))
    : 'dev'

  // Add template local variables
  app.use((req, res, next) => {
    res.locals.config = config
    res.locals.styleHash = styleHash
    res.locals.scriptHash = scriptHash
    res.locals.nonce = createNonce()

    next()
  })

  // Set up session store
  const sessionStore = new MySQLStore(dbSecret.connection)
  app.use(session({
    store: sessionStore,
    // Secret used to sign the session ID cookie
    secret: cookieSecret.secret,
    // Only save a session to the store if it was modified
    resave: false,
    // Do not save "uninitialized" sessions to the store
    saveUninitialized: false,
    // Delete session from store when `req.session` is unset
    unset: 'destroy',
    cookie: {
      // Prevent cookies from being accessed by client JavaScript
      httpOnly: true,
      // Time (in ms) until cookies will be deleted
      maxAge: config.maxAgeCookie,
      // Omit cookies for requests initiated on other origins
      sameSite: 'lax',
      // Prevent cookies from being sent over insecure HTTP
      secure: config.isProd
    }
  }))

  // Log HTTP requests
  app.use(morgan(config.isProd ? 'combined' : 'dev'))

  // Serve API routes
  app.use('/api', routerApi)
  app.use(routerFeed)

  // Headers to send with HTML responses
  app.use((req, res, next) => {
    // Enable browser XSS filtering. Usually enabled by default, re-enable
    // it if it was disabled by the user and asks the the browser to
    // prevent rendering of the page if an attack is detected.
    res.header('X-XSS-Protection', '1; mode=block')

    res.header('Feature-Policy', oneLine`
      geolocation
        'none'
      ;
      sync-xhr
        'none'
      ;
      unsized-media
        'none'
      ;
    `)

    // Prevent XSS attacks by explicitly specifying sources of content
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
        https://www.google-analytics.com
      ;
      font-src
        'self'
      ;
      img-src
        'self'
        https://www.google-analytics.com
      ;
      manifest-src
        'self'
      ;
      script-src
        'strict-dynamic' *
        'unsafe-eval'
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

  // Serve routes with server-side rendering
  app.get('*', routerRender)

  // Log errors
  if (global.rollbar) app.use(global.rollbar.errorHandler())

  // Handle errors with the same server-side rendering path
  app.use((err, req, res, next) => {
    req.err = err
    routerRender(req, res, next)
  })

  return app
}

// Returns an express.static middleware, configured correctly
function serveStatic (path) {
  return express.static(path, {
    // Time (in ms) until static content will be deleted from cache
    maxAge: config.maxAgeStatic
  })
}

// Create a hash for static assets like `bundle.js` and `bundle.css` to use
// in a cache-busting query parameter
function createHash (data) {
  return trimHash(crypto.createHash('sha256').update(data).digest('base64'))
}

// Create a random nonce to use in CSP
function createNonce () {
  return trimHash(Buffer.from(uuid()).toString('base64'))
}

// Trim hashes or nonces to a reasonable size
function trimHash (str) {
  return str.slice(0, 20).replace(/\+|\/|=/g, '')
}

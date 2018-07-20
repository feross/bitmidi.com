import crypto from 'crypto'
import express from 'express'
import fs from 'fs'
import MySQLSession from 'express-mysql-session'
import { join, dirname } from 'path'
import session from 'express-session'
import uuid from 'uuid/v4'
import oneLine from 'common-tags/lib/oneLine'

import * as config from '../config'
import { cookie as cookieSecret, db as dbSecret } from '../../secret'

import routerApi from './router-api'
import routerApp from './router-app'
import routerFeed from './router-feed'

// Set correct mime-type for streaming wasm compilation
// See: https://github.com/expressjs/express/issues/3589
// TODO: Remove when express 4.17.0 is released
express.static.mime.types['wasm'] = 'application/wasm'

// Set correct mime type for .pat (Gravis Ultrasound) files
express.static.mime.types['pat'] = 'audio/pat'

const MySQLStore = MySQLSession(session)

export default function init () {
  const app = express()

  app.set('view engine', 'ejs') // Use EJS for server-side templating
  app.set('views', join(config.rootPath, 'src', 'server')) // Template folder

  app.set('trust proxy', true) // Trust the nginx reverse proxy
  app.set('json spaces', config.isProd ? 0 : 2) // Pretty-print JSON in development
  app.set('x-powered-by', false) // Prevent server fingerprinting

  // Headers to send with all responses
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
  function serveStatic (path) {
    const opts = {
      // Time (in ms) until static content will be deleted from cache
      maxAge: config.maxAgeStatic
    }
    return express.static(path, opts)
  }

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
    ? createHash(fs.readFileSync(join(staticPath, 'bundle.css')))
    : 'dev'

  const scriptHash = config.isProd
    ? createHash(fs.readFileSync(join(staticPath, 'bundle.js')))
    : 'dev'

  app.use((req, res, next) => {
    // Add template local variables
    res.locals.config = config
    res.locals.styleHash = styleHash
    res.locals.scriptHash = scriptHash
    res.locals.nonce = Buffer.from(uuid()).toString('base64')

    next()
  })

  // Set up session store
  const sessionStore = new MySQLStore(dbSecret.connection)
  app.use(session({
    store: sessionStore,
    secret: cookieSecret,
    resave: false,
    saveUninitialized: false,
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

  app.use('/api', routerApi)
  app.use(routerFeed)

  // Headers to send with HTML responses
  app.use((req, res, next) => {
    // Enable browser XSS filtering. Usually enabled by default, but this header re-
    // enables it if it was disabled by the user, and asks the the browser to prevent
    // rendering of the page if an attack is detected.
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

    // Prevent XSS attacks with by explicitly specifying sources of content.
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

  app.get('/500', (req, res, next) => next(new Error('Manually visited /500')))

  // Render all routes on the server
  app.get('*', routerApp)

  // Log errors to Opbeat
  if (global.opbeat) app.use(global.opbeat.middleware.express())

  // Handle errors with the same server-side rendering path
  app.use((err, req, res, next) => {
    req.err = err
    routerApp(req, res, next)
  })

  return app
}

// Create a cache-busting hash for static assets like `bundle.js` and `bundle.css`
function createHash (data) {
  return crypto.createHash('sha256')
    .update(data)
    .digest('base64')
    .slice(0, 20)
    .replace(/\+|\/|=/g, '')
}

import crypto from 'crypto'
import express from 'express'
import fs from 'fs'
import MySQLSession from 'express-mysql-session'
import path from 'path'
import session from 'express-session'
import uuid from 'uuid/v4'
import { oneLine } from 'common-tags'

import config from '../../config'
import { cookie as cookieSecret, db as dbSecret } from '../../secret'

import routerApi from './router-api'
import routerApp from './router-app'
import routerFeed from './router-feed'

const MySQLStore = MySQLSession(session)

export default function init () {
  const app = express()

  app.set('view engine', 'ejs') // Use EJS for server-side templating
  app.set('views', path.join(config.rootPath, 'src', 'server')) // Template folder

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

  // Set up session store
  const sessionStore = new MySQLStore(dbSecret.connection)
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

  // Headers to send with HTML responses
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

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

import serveWebp from '../lib/serve-webp'
import * as config from '../config'
import { cookie as cookieSecret, db as dbSecret } from '../../secret'

import routerApi from './router-api'
import routerFeed from './router-feed'
import routerRender from './router-render'

const { isProd, rootPath } = config

// Set correct mime-type for streaming wasm compilation
// See: https://github.com/expressjs/express/issues/3589
// TODO: Remove when express 4.17.0 is released
express.static.mime.types['wasm'] = 'application/wasm'

// Set correct mime type for .pat (Gravis Ultrasound) files
express.static.mime.types['pat'] = 'audio/pat'

export default function init () {
  const app = express()

  // Use EJS for server-side templating
  app.set('view engine', 'ejs')
  app.set('views', join(rootPath, 'src', 'server'))
  app.locals.rmWhitespace = isProd
  app.locals.compileDebug = !isProd

  app.set('trust proxy', true) // Trust the nginx reverse proxy
  app.set('json spaces', isProd ? 0 : 2) // Pretty JSON (in dev)
  app.set('x-powered-by', false) // Prevent server fingerprinting

  // Headers to send with all responses
  app.use((req, res, next) => {
    // Redirect to canonical origin, over https
    if (isProd && req.method === 'GET' &&
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
    if (isProd) {
      res.header(
        'Strict-Transport-Security',
        `max-age=${config.maxAgeHSTS / 1000}; includeSubDomains; preload`
      )
    }

    next()
  })

  // Serve favicon
  app.use(favicon(join(rootPath, 'static', 'favicon.ico'), {
    maxAge: config.maxAgeStatic
  }))

  // Serve static files
  const iconsPath = dirname(require.resolve('material-design-icons'))
  app.use('/icons', serveStatic(iconsPath))

  const timidityPath = dirname(require.resolve('timidity'))
  app.use('/timidity', serveStatic(timidityPath))

  const freepatsPath = dirname(require.resolve('freepats'))
  app.use('/freepats', serveStatic(freepatsPath))

  const uploadsPath = join(rootPath, 'uploads')
  app.use('/uploads', serveStatic(uploadsPath))

  const staticPath = join(rootPath, 'static')
  app.use('/webp/icons', serveWebp(iconsPath))
  app.use('/webp', serveWebp(staticPath))
  app.use(serveStatic(staticPath))

  // Read CSS for inlining in page
  const style = isProd
    ? readFileSync(join(staticPath, 'bundle.css'), 'utf8')
    : ''

  // Compute hash for far-future cached static resources for invalidation
  const scriptHash = isProd
    ? createHash(readFileSync(join(staticPath, 'bundle.js')))
    : 'dev'

  // Add app template variables
  app.locals.config = config
  app.locals.style = style
  app.locals.scriptHash = scriptHash

  // Add per-request template variables
  app.use((req, res, next) => {
    res.locals.nonce = createNonce()
    next()
  })

  // Set up session store
  const MySQLStore = MySQLSession(session)
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
      secure: isProd
    }
  }))

  // Log HTTP requests
  app.use(morgan(isProd ? 'combined' : 'dev', { immediate: !isProd }))

  // Serve API routes
  app.use('/api', routerApi)
  app.use(routerFeed)

  // Headers to send with HTML responses
  app.use((req, res, next) => {
    // Enable browser XSS filtering. Usually enabled by default, re-enable
    // it if it was disabled by the user and asks the the browser to
    // prevent rendering of the page if an attack is detected.
    res.header('X-XSS-Protection', '1; mode=block')

    const devFeaturePolicy = !isProd && `
      image-compression
        'none'
      ;
      legacy-image-formats
        'none'
      ;
      unsized-media
        'none'
      ;
    `
    res.header('Feature-Policy', oneLine`
      sync-xhr
        'none'
      ;
      ${devFeaturePolicy || ''}
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

  app.get('/500', () => { throw new Error('Manually visited /500') })

  // Serve routes with server-side rendering
  app.get('*', routerRender)

  // Log errors
  if (global.rollbar) app.use(global.rollbar.errorHandler())

  // Handle errors with the same server-side rendering path
  app.use((err, req, res, next) => {
    console.error(err.stack)
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
  return trimBase64(crypto.createHash('sha256').update(data).digest('base64'))
}

// Create a random nonce to use in CSP
function createNonce () {
  return trimBase64(Buffer.from(uuid()).toString('base64'))
}

// Trim base64 hashes or nonces to a reasonable size
function trimBase64 (str) {
  return str.replace(/\+|\/|=/g, '').slice(0, 24)
}

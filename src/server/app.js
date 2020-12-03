import cors from 'cors'
import crypto from 'crypto'
import express from 'express'
import favicon from 'serve-favicon'
import morgan from 'morgan'
import MySQLSession from 'express-mysql-session'
import oneLine from 'common-tags/lib/oneLine'
import rateLimit from 'express-rate-limit'
import session from 'express-session'
import { join, dirname } from 'path'
import { readFileSync } from 'fs'
import { v4 as uuid } from 'uuid'

import serveWebp from '../lib/serve-webp'
import * as config from '../config'
import { cookie as cookieSecret, db as dbSecret } from '../../secret'

import routerAds from './router-ads'
import routerApi from './router-api'
import routerFeed from './router-feed'
import routerRender from './router-render'

const { isProd, rootPath } = config

const staticPath = join(rootPath, 'static')

// Set correct mime type for .pat (Gravis Ultrasound) files
express.static.mime.types.pat = 'audio/pat'

export default function init () {
  const app = express()

  // Styles are inlined in page
  app.locals.style = isProd
    ? readFileSync(join(staticPath, 'bundle.css'), 'utf8')
    : ''

  // Compute hash of `bundle.js` so it can be invalidated when changed
  app.locals.scriptHash = isProd
    ? createHash(readFileSync(join(staticPath, 'bundle.js')))
    : 'dev'

  app.locals.config = config

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
    // TODO: disabled becuase site is showing ads
    // res.header('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Prevent cross-origin reads of site resources to mitigate side-channel
    // attacks. Reduces the risk of leaking sensitive data by keeping it further
    // from cross-origin web pages.
    // TODO: disabled becuase site is showing ads
    // res.header('Cross-Origin-Resource-Policy', 'same-origin')

    // Prevent cross-window attacks (window.opener, usage of postMessage) and
    // process side-channel attacks by severing references to other browsing
    // contexts. Browsers will use a separate OS process to load the site.
    // TODO: disabled becuase site is showing ads
    // res.header('Cross-Origin-Opener-Policy', 'same-origin')

    // Use HTTP Strict Transport Security (HSTS), cached for 2 years,
    // including on subdomains, and allow browser preload.
    res.header(
      'Strict-Transport-Security',
      `max-age=${config.maxAgeHSTS / 1000}; includeSubDomains; preload`
    )

    // Prevent click-jacking attacks by forbidding site resources from being
    // embedded using frames.
    res.header('Content-Security-Policy', oneLine`
      frame-ancestors
        'none'
      ;
    `)

    // Add per-request template variables
    res.locals.nonce = createNonce()

    next()
  })

  // Serve favicon
  const faviconPath = join(rootPath, 'static', 'favicon.ico')
  app.use(favicon(faviconPath, { maxAge: config.maxAgeStatic }))

  // Serve static files
  const iconsPath = dirname(require.resolve('material-design-icons'))
  app.use('/icons', serveStatic(iconsPath))

  const timidityPath = dirname(require.resolve('timidity'))
  app.use('/timidity', cors(), serveStatic(timidityPath))

  const freepatsPath = dirname(require.resolve('freepats'))
  app.use('/timidity', cors(), serveStatic(freepatsPath))

  const uploadsPath = join(rootPath, 'uploads')
  app.use('/uploads', cors(), serveStatic(uploadsPath))

  app.use('/webp/icons', serveWebp(iconsPath))
  app.use('/webp', serveWebp(staticPath))
  app.use(serveStatic(staticPath))

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
  const logger = morgan(isProd ? 'combined' : 'dev', { immediate: !isProd })
  app.use(logger)

  // Serve API routes
  app.use('/api', routerApi)

  // Server feed routes
  app.use(routerFeed)

  // Serve ads.txt route
  app.use(routerAds)

  // Headers to send with HTML responses
  app.use((req, res, next) => {
    // Enable browser XSS filtering. Usually enabled by default, re-enable
    // it if it was disabled by the user and asks the the browser to
    // prevent rendering of the page if an attack is detected.
    res.header('X-XSS-Protection', '1; mode=block')

    res.header('Permissions-Policy',
      isProd
        ? oneLine`
          vertical-scroll=(),
        `
        : oneLine`
          vertical-scroll=(),
          sync-xhr=()
        `
    )

    res.header('Document-Policy',
      isProd
        ? oneLine`
        `
        : oneLine`
          oversized-images=2.0,
          unoptimized-lossy-images=1.0,
          unoptimized-lossless-images=1.0,
          unoptimized-lossless-images-strict=1.0,
          unsized-media=?0
        `
    )

    // Prevent XSS attacks by explicitly specifying sources of content
    // Notes:
    //   - Before: frame-ancestors 'none'
    //     Why changed: Allow Twitter to embed the Player Card in an iframe
    //   - Before: frame-src inherited from the default-src policy
    //     Why changed: AdSense embeds iframes
    //   - Before: script-src 'strict-dynamic' 'nonce-${res.locals.nonce}'
    //     Why changed: AdSense uses document.write() to write inline scripts
    //     without nonce, which requires 'unsafe-inline'
    //   - Before: default-src 'self' data:; connect-src *; frame-ancestors *;
    //             frame-src *; img-src *; object-src 'none'; script-src 'unsafe-eval' * 'unsafe-inline'; style-src 'self' 'unsafe-inline';
    //     Why changed: Optimize prefetches from a random URL and rather than
    //     add yet another execption (prefetch-src *;) let's just keep things
    //     simple.
    //   - TODO: Remove script-src 'unsafe-eval' once wasm-unsafe-eval ships
    //     https://bugs.chromium.org/p/chromium/issues/detail?id=948834&can=1&q=wasm-eval
    //   - TODO: Remove script-src * 'unsafe-inline' fallback once Safari
    //     supports strict-dynamic
    //     https://bugs.webkit.org/show_bug.cgi?id=184031
    res.header('Content-Security-Policy', oneLine`
      base-uri
        'none'
      ;
    `)

    next()
  })

  // app.get('/500', () => { throw new Error('Manually visited /500') })

  // Rate limit HTTP requests
  morgan.format(
    'rate-limit',
    'Blocked for too many requests - :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  )
  const rateLimitLogger = morgan('rate-limit', { immediate: !isProd })
  const rateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    headers: false,
    handler: (req, res, next) => {
      rateLimitLogger(req, res, () => {})
      res.status(503).send('Blocked for too many requests')
    }
  })
  app.use(rateLimiter)

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
  return express.static(path, { maxAge: config.maxAgeStatic })
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

const isBrowser = typeof window !== 'undefined'

const isProd = isBrowser
  ? window.location.hostname !== 'localhost'
  : require('pro' + 'cess').env.NODE_ENV === 'production'

/**
 * Is the javascript environment a browser?
 */
exports.isBrowser = isBrowser

/**
 * Is the site running in production?
 */
exports.isProd = isProd

/**
 * Title of the site
 */
exports.title = 'Node Foo'

/**
 * Description of the site
 */
exports.description = 'Node.js examples and code snippets'

/**
 * Keywords of the site
 */
exports.keywords = [
  'programming',
  'coding',
  'code',
  'node.js'
]

/**
 * Website hostname + port
 */
exports.host = isProd
  ? 'nodefoo.com'
  : 'localhost:4000'

/**
 * HTTP origin
 */
exports.httpOrigin = (isProd ? 'https' : 'http') + '://' + exports.host

/**
 * Websocket origin
 */
// exports.wsOrigin = (isProd ? 'wss' : 'ws') + '://' + exports.host

/**
 * Root path of project
 */
exports.rootPath = isBrowser ? '/' : __dirname

/**
 * Maximum time to cache static resources (in milliseconds). This value is sent in the HTTP
 * cache-control header.
 */
exports.maxAge = isProd
  ? 7 * 24 * 3600000 // 7 days
  : 0

/**
 * Time to wait in milliseconds before an API request is considered timed out.

/**
 * Time (in milliseconds) to cache the HTTP Strict Transport Security (HSTS)
 * setting. This value is sent in the HTTP "Strict-Transport-Security" header as
 * the "max-age" attribute.
 */
exports.maxAgeHSTS = 365 * 24 * 60 * 60 * 1000 // 1 year
 */
exports.apiTimeout = 30 * 1000

/**
 * User agent for API requests
 */
exports.apiUserAgent = 'NodeFoo/1.0.0 (https://nodefoo.com)'

/**
 * Website theme colors
 */
exports.theme = {
  mainColor: 'blue',
  headerColor: 'hot-pink'
}

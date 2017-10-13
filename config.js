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
 * Server listening port
 */
exports.port = isProd
  ? 7800
  : 4000

/**
 * Name of the site
 */
exports.name = 'Node Foo'

/**
 * Description of the site
 */
exports.description = 'Node.js examples and code snippets'

/**
 * Website hostname + port
 */
exports.host = isProd
  ? 'nodefoo.com'
  : 'localhost:' + exports.port

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
exports.root = __dirname

/**
 * Maximum time to cache static resources (in milliseconds). This value is sent in the HTTP
 * cache-control header.
 */
exports.maxAge = isProd
  ? 7 * 24 * 3600000 // 7 days
  : 0

/**
 * Time to wait in milliseconds before an API request is considered timed out.
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

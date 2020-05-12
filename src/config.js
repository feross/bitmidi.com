import oneLine from 'common-tags/lib/oneLine'
import { join } from 'path'

// Is the javascript environment a browser?
export const isBrowser = typeof window !== 'undefined'

// Is the site running in production?
export const isProd = isBrowser
  ? window.location.hostname !== 'localhost'
  : process.env.NODE_ENV === 'production'

// Title of the site
export const siteName = 'BitMidi'

// Description of the site
export const siteDesc = oneLine`
  Listen to free MIDI songs, download the best MIDI files, and share the
  best MIDIs on the web.
`

// Keywords of the site
export const siteKeywords = [
  'free midi',
  'mid',
  'midi files',
  'midi',
  'music'
]

// Twitter username of the site
export const siteTwitter = 'BitMidi'

// Default image to represent the site on social networks
export const siteImage = '/img/hero.jpg'

// Token ids
export const tokens = {
  adsense: 'ca-pub-7826623632932605',
  analytics: 'UA-3898076-25',
  carbon: 'CE7DT2Q7&placement=bitmidicom',
  quantcast: 'p-69FZJwoXOxhpY'
}

// Website hostname + port
export const host = isProd
  ? 'bitmidi.com'
  : 'localhost:4000'

// Website origin (scheme + hostname + port)
export const origin = (isProd ? 'https' : 'http') + '://' + host

// Root path of project
export const rootPath = isBrowser
  ? '/'
  : join(__dirname, '..')

// Time (in ms) to cache static resources. This value is sent in the HTTP
// "Cache-Control" header.
export const maxAgeStatic = isProd
  ? 365 * 24 * 60 * 60 * 1000 // 1 year
  : 0

// Time (in ms) to keep cookies before deletion. This value is sent in the
// HTTP "Set-Cookie" header as the "Expires" attribute.
export const maxAgeCookie = isProd
  ? 5 * 365 * 24 * 60 * 60 * 1000 // 5 years
  : 0

// Time (in ms) to cache the HTTP "Strict-Transport-Security" (HSTS)
// setting. This value is sent as the "max-age" attribute in the header.
export const maxAgeHSTS = 365 * 24 * 60 * 60 * 1000 // 1 year

// Time (in ms) to wait before an API request is considered timed out
export const apiTimeout = 30 * 1000

// User agent for API requests
export const apiUserAgent = `${siteName}/1.0.0 (${origin})`

// Website theme colors
export const theme = {
  mainColor: 'dark-blue',
  headerColor: 'hot-pink',
  headerColorHex: '#ff41b4'
}

// Number of results on pages with lists
export const pageSize = 15
export const maxPageSize = 50

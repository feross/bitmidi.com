/* global self, Request, URL, fetch, caches */

'use strict'

// Incrementing CACHE_VERSION will kick off the 'install' event and force previously
// cached resources to be cached again.
const CACHE_VERSION = 1

const CURRENT_CACHES = {
  offline: 'offline-v' + CACHE_VERSION
}
const START_URL = './'
const OFFLINE_URL = './offline.html'

function createCacheBustingRequest (url) {
  const request = new Request(url, { cache: 'reload' })
  // See https://fetch.spec.whatwg.org/#concept-request-mode
  // Note: Not supported in Chrome, so check to see if the option had any effect.
  if ('cache' in request) {
    return request
  }

  // Append a cache-busting param if {cache: 'reload'} didn't have an effect
  const bustedUrl = new URL(url, self.location.href)
  bustedUrl.search += (bustedUrl.search ? '&' : '') + 'c=' + Date.now()
  return new Request(bustedUrl)
}

async function addToCache (url) {
  // We can't use cache.add() here, since we want `url` to be the cache key but
  // the actual URL we end up requesting might include a cache-busting parameter.
  const response = await fetch(createCacheBustingRequest(url))
  if (!response.ok) {
    throw new Error(`HTTP response error. ${response.status}`)
  }
  const cache = await caches.open(CURRENT_CACHES.offline)
  await cache.put(url, response)
}

self.addEventListener('install', event => {
  // Note: START_URL is never actually served from cache by the service worker. This
  // exists temporarily to pass the Lighthouse audit.
  event.waitUntil(Promise.all([
    addToCache(START_URL),
    addToCache(OFFLINE_URL)
  ]))
})

self.addEventListener('activate', event => {
  // Delete all caches that aren't named in CURRENT_CACHES. While there is only one
  // cache in this example, the same logic will handle the case where there are
  // multiple versioned caches.
  const expectedNames = Object.values(CURRENT_CACHES)

  event.waitUntil((async () => {
    const names = await caches.keys()
    await Promise.all(names.map(name => {
      if (!expectedNames.includes(name)) {
        console.log('Deleting out-of-date cache', name)
        return caches.delete(name)
      }
    }))
  })())
})

self.addEventListener('fetch', event => {
  // Only handle navigation requests (top-level HTML pages).
  // NOTE: request.mode of 'navigate' is not supported in Edge.
  // versions older than 49, so we need to include a less precise fallback,
  // which checks for a GET request with an Accept: text/html header.
  //  ||
  // (event.request.method === 'GET' &&
  //  event.request.headers.get('accept').includes('text/html'))
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(error => {
        // The catch is only triggered if fetch() throws an exception, which will most likely
        // happen due to the server being unreachable.
        // If fetch() returns a valid HTTP response with an response code in the 4xx or 5xx
        // range, the catch() will NOT be called. If you need custom handling for 4xx or 5xx
        // errors, see https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/fallback-response
        console.log('Fetch failed, returning offline page.', error)
        return caches.match(OFFLINE_URL)
      })
    )
  }

  // If our if() condition is false, then this fetch handler won't intercept the request.
  // If there are any other fetch handlers registered, they will get a chance to call
  // event.respondWith(). If no fetch handlers call event.respondWith(), the request will be
  // handled by the browser as if there were no service worker involvement.
})

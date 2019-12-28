/* global self, Request, fetch, caches */

'use strict'

// Increment the version to kick off the 'install' event and force previously
// cached resources to be cached again.
const CACHE_VERSION = 1

const CACHES = {
  offline: 'offline-v' + CACHE_VERSION
}

const OFFLINE_URL = './offline.html'

async function cacheAdd (cache, url) {
  // Set cache mode to 'reload' to ensure response comes from the network
  return cache.add(new Request(url, { cache: 'reload' }))
}

self.addEventListener('install', event => {
  event.waitUntil(async function () {
    const offlineCache = await caches.open(CACHES.offline)
    return cacheAdd(offlineCache, OFFLINE_URL)
  }())
})

self.addEventListener('activate', event => {
  event.waitUntil(async function () {
    if ('navigationPreload' in self.registration) {
      // Enable navigation preloads
      // https://developers.google.com/web/updates/2017/02/navigation-preload
      await self.registration.navigationPreload.enable()
    }

    // Delete all caches that aren't named in CACHES
    const expectedNames = new Set(Object.values(CACHES))
    const names = await caches.keys()

    return Promise.all(
      names
        .filter(name => !expectedNames.has(name))
        .map(name => {
          console.log('Deleting out-of-date cache', name)
          return caches.delete(name)
        })
    )
  }())
})

self.addEventListener('fetch', event => {
  event.respondWith(async function () {
    try {
      // Use the preloaded response, if one exists
      const preloadResponse = await event.preloadResponse
      if (preloadResponse) return preloadResponse
    } catch (err) {
      // Ignore errors
    }

    try {
      const response = await fetch(event.request)
      return response
    } catch (err) {
      // fetch() throws an exception when the server is unreachable. If fetch()
      // returns a valid HTTP response with a status code in the 4xx or 5xx
      // range, then an exception will NOT be thrown.

      if (event.request.mode !== 'navigate') {
        // Only return the offline page for navigation requests (i.e. top-level
        // HTML pages)
        throw err
      }

      const { url } = event.request
      console.log(`Return offline page because fetch failed for ${url}: `, err)
      return caches.match(OFFLINE_URL)
    }
  }())
})

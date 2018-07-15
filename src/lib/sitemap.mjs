import builder from 'xmlbuilder'
import mem from 'mem'

const MAX_SITEMAP_LENGTH = 50 * 1000 // Max URLs in a sitemap (defined by spec)
const SITEMAP_URL_RE = /\/sitemap(-\d+)?\.xml/ // Sitemap url pattern
const SITEMAP_MAX_AGE = 24 * 60 * 60 * 1000 // Cache sitemaps for 24 hours

export default function sitemapMiddleware (loadUrls, base) {
  if (typeof loadUrls !== 'function') {
    throw new Error('Argument `loadUrls` must be a function')
  }
  if (typeof base !== 'string') {
    throw new Error('Argument `base` must be a string')
  }

  function load () {
    return loadSitemaps(loadUrls, base)
  }

  const memoizedLoad = mem(load, { maxAge: SITEMAP_MAX_AGE })

  return async (req, res, next) => {
    const isSitemapUrl = SITEMAP_URL_RE.test(req.url)
    if (isSitemapUrl) {
      const sitemaps = await memoizedLoad()
      if (sitemaps[req.url]) {
        return res.status(200).send(sitemaps[req.url])
      }
    }
    next()
  }
}

async function loadSitemaps (loadUrls, base) {
  const urls = await loadUrls()

  if (!Array.isArray(urls)) {
    throw new Error('async function `loadUrls` must resolve to an Array')
  }

  const sitemaps = Object.create(null)

  if (urls.length <= MAX_SITEMAP_LENGTH) {
    // If there is only one sitemap (i.e. there are less than 50,000 URLs)
    // then serve it directly at /sitemap.xml
    sitemaps['/sitemap.xml'] = buildSitemap(urls, base)
  } else {
    // Otherwise, serve a sitemap index at /sitemap.xml and sitemaps at
    // /sitemap-1.xml, /sitemap-2.xml, etc.
    for (let i = 0; i * MAX_SITEMAP_LENGTH < urls.length; i++) {
      const start = i * MAX_SITEMAP_LENGTH
      const selectedUrls = urls.slice(start, start + MAX_SITEMAP_LENGTH)
      sitemaps[`/sitemap-${i}.xml`] = buildSitemap(selectedUrls, base)
    }
    sitemaps['/sitemap.xml'] = buildSitemapIndex(sitemaps, base)
  }

  return sitemaps
}

function buildSitemapIndex (sitemaps, base) {
  const sitemapObjs = Object.keys(sitemaps).map((sitemapUrl, i) => {
    return {
      loc: toAbsolute(sitemapUrl, base),
      lastmod: getTodayStr()
    }
  })

  const sitemapIndexObj = {
    sitemapindex: {
      '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      sitemap: sitemapObjs
    }
  }

  return buildXml(sitemapIndexObj)
}

function buildSitemap (urls, base) {
  const urlObjs = urls.map(url => {
    if (typeof url === 'string') {
      return {
        loc: toAbsolute(url, base),
        lastmod: getTodayStr()
      }
    }

    if (typeof url.url !== 'string') {
      throw new Error(`Invalid sitemap url object ${url}`)
    }

    const urlObj = {
      loc: toAbsolute(url.url, base),
      lastmod: url.lastMod || getTodayStr()
    }
    if (typeof url.changeFreq === 'string') {
      urlObj.changefreq = url.changeFreq
    }
    return urlObj
  })

  const sitemapObj = {
    urlset: {
      '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      url: urlObjs
    }
  }

  return buildXml(sitemapObj)
}

function buildXml (obj) {
  const opts = {
    encoding: 'utf-8',
    skipNullAttributes: true,
    skipNullNodes: true
  }
  const xml = builder.create(obj, opts)
  return xml.end({ pretty: true, allowEmpty: false })
}

function getTodayStr () {
  return new Date().toISOString().split('T')[0]
}

function toAbsolute (url, base) {
  return new URL(url, base).href
}

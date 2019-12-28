import expressSitemapXml from 'express-sitemap-xml'
import jsonfeedToAtom from 'jsonfeed-to-atom'
import Router from 'express-promise-router'
import oneLine from 'common-tags/lib/oneLine'

import api from '../api'
import asyncFlatMap from '../lib/async-flatmap'
import routes from '../routes'
import { siteName, siteDesc, siteKeywords, origin } from '../config'

const router = Router()

router.get('/feed.json', async (req, res) => {
  const jsonFeed = await getJsonFeed()
  res.status(200).json(jsonFeed)
})

router.get('/feed.xml', async (req, res) => {
  const jsonFeed = await getJsonFeed()
  const atomFeed = jsonfeedToAtom(jsonFeed)
  res
    .status(200)
    .set('Content-Type', 'application/atom+xml')
    .send(atomFeed)
})

router.use(expressSitemapXml(getUrls, origin))

function getUrls () {
  const sitemapRoutes = routes.filter(route => route.sitemap)
  return asyncFlatMap(sitemapRoutes, async route => {
    return route.sitemap === true
      ? route.path
      : route.sitemap()
  })
}

async function getJsonFeed () {
  const { results } = await api.midi.all({
    orderBy: 'createdAt',
    pageSize: 100
  })

  const feed = {
    version: 'https://jsonfeed.org/version/1',
    title: siteName,
    description: siteDesc,
    home_page_url: `${origin}/`,
    feed_url: `${origin}/feed.json`,
    user_comment: oneLine`
      This feed allows you to read the posts from ${siteName} in any feed
      reader that supports the JSON Feed format. To add this feed to your
      reader, copy the following URL — ${origin}/feed.json — and add
      it your reader.
    `,
    favicon: `${origin}/favicon.ico`,
    icon: `${origin}/android-chrome-512x512.png`,
    author: {
      name: siteName,
      url: `${origin}/`,
      avatar: `${origin}/android-chrome-512x512.png`
    }
  }

  feed.items = results.map(midi => {
    const url = `${origin}${midi.url}`
    return {
      id: url,
      url: url,
      title: midi.name,
      content_html: oneLine`
        The MIDI file <a href='${url}'>${midi.name}</a> was added to
        BitMidi.
      `,
      content_text: oneLine`
        The MIDI file "${midi.name}" was added to BitMidi. View it at:
        ${url}
      `,
      summary: midi.name,
      image: midi.image,
      date_published: (new Date(midi.createdAt)).toISOString(),
      date_modified: (new Date(midi.updatedAt)).toISOString(),
      author: {
        name: siteName,
        url: `${origin}/`,
        avatar: `${origin}/android-chrome-512x512.png`
      },
      tags: siteKeywords
    }
  })

  return feed
}

export default router

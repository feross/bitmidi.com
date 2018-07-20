import expressSitemapXml from 'express-sitemap-xml'
import jsonfeedToAtom from 'jsonfeed-to-atom'
import Router from 'express-promise-router'
import oneLine from 'common-tags/lib/oneLine'

import api from '../api'
import { title, description, keywords, httpOrigin } from '../config'

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

router.use(expressSitemapXml(getUrls, httpOrigin))

async function getUrls () {
  const { results } = await api.midi.all({
    select: ['slug'],
    orderBy: 'views',
    pageSize: Infinity
  })
  return ['/'].concat(results.map(result => result.url))
}

async function getJsonFeed () {
  const { results } = await api.midi.all({
    orderBy: 'createdAt',
    pageSize: 100
  })

  const feed = {
    version: 'https://jsonfeed.org/version/1',
    title: title,
    description: description,
    home_page_url: `${httpOrigin}/`,
    feed_url: `${httpOrigin}/feed.json`,
    user_comment: oneLine`
      This feed allows you to read the posts from ${title} in any feed
      reader that supports the JSON Feed format. To add this feed to your
      reader, copy the following URL — ${httpOrigin}/feed.json — and add
      it your reader.
    `,
    favicon: `${httpOrigin}/favicon.ico`,
    icon: `${httpOrigin}/android-chrome-512x512.png`,
    author: {
      name: title,
      url: `${httpOrigin}/`,
      avatar: `${httpOrigin}/android-chrome-512x512.png`
    }
  }

  feed.items = results.map(midi => {
    const url = `${httpOrigin}${midi.url}`
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
      date_published: midi.createdAt.toISOString(),
      date_modified: midi.updatedAt.toISOString(),
      author: {
        name: title,
        url: `${httpOrigin}/`,
        avatar: `${httpOrigin}/android-chrome-512x512.png`
      },
      tags: keywords
    }
  })

  return feed
}

export default router

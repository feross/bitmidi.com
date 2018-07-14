import jsonfeedToAtom from 'jsonfeed-to-atom'
import Router from 'express-promise-router'
import { oneLine } from 'common-tags'

import api from '../api'
import config from '../../config'

const router = Router()

router.get('/feed.json', async (req, res, next) => {
  const jsonFeed = await getJsonFeed()
  res.status(200).send(jsonFeed)
})

router.get('/feed.xml', async (req, res, next) => {
  const jsonFeed = await getJsonFeed()
  const atomFeed = jsonfeedToAtom(jsonFeed)
  res.status(200).send(atomFeed)
})

async function getJsonFeed () {
  const { results } = await api.midi.all()

  const feed = {
    version: 'https://jsonfeed.org/version/1',
    title: config.title,
    description: config.description,
    home_page_url: `${config.httpOrigin}/`,
    feed_url: `${config.httpOrigin}/feed.json`,
    user_comment: oneLine`
      This feed allows you to read the posts from ${config.title} in any feed
      reader that supports the JSON Feed format. To add this feed to your
      reader, copy the following URL — ${config.httpOrigin}/feed.json — and add
      it your reader.
    `,
    favicon: `${config.httpOrigin}/favicon.ico`,
    icon: `${config.httpOrigin}/android-chrome-512x512.png`,
    author: {
      name: config.title,
      url: `${config.httpOrigin}/`,
      avatar: `${config.httpOrigin}/android-chrome-512x512.png`
    }
  }

  feed.items = results.map(midi => {
    return {
      id: midi.url,
      url: midi.url,
      title: midi.name,
      content_html: midi.name,
      content_text: midi.name,
      summary: midi.name,
      image: midi.image,
      date_published: midi.createdAt.toISOString(),
      date_modified: midi.updatedAt.toISOString(),
      author: {
        name: config.title,
        url: `${config.httpOrigin}/`,
        avatar: `${config.httpOrigin}/android-chrome-512x512.png`
      },
      tags: config.keywords
    }
  })

  return feed
}

export default router

import Router from 'express-promise-router'

import api from '../api'
import config from '../../config'
import { oneLine } from 'common-tags'

const router = Router()

router.get('/feed.xml', async (req, res, next) => {
  const midis = await api.midi.all(req.query)
  // if (err) return res.sendStatus(500)

  res.status(200)
  res.render('feed', { midis })
})

router.get('/feed.json', async (req, res, next) => {
  const midis = await api.midi.all(req.query)
  // if (err) return res.sendStatus(500)

  const feed = {
    version: 'https://jsonfeed.org/version/1',
    title: config.title,
    description: config.description,
    home_page_url: `${config.httpOrigin}/`,
    feed_url: `${config.httpOrigin}/feed.json`,
    user_comment: oneLine`
      This feed allows you to read the posts from this site in any feed reader
      that supports the JSON Feed format. To add this feed to your reader, copy
      the following URL — ${config.httpOrigin}/feed.json — and add it your reader.
    `,
    favicon: `${config.httpOrigin}/favicon.ico`,
    icon: `${config.httpOrigin}/android-chrome-512x512.png`,
    author: {
      name: config.title,
      url: `${config.httpOrigin}/`,
      avatar: `${config.httpOrigin}/android-chrome-512x512.png`
    }
  }

  feed.items = midis.map(midi => {
    return {
      id: midi.url,
      url: midi.url,
      title: midi.name,
      content_html: midi.html,
      content_text: midi.code,
      summary: midi.name,
      // date_published: '', // TODO
      // date_modified: '', // TODO
      author: {
        name: `@${midi.author}`,
        url: midi.author_url,
        avatar: midi.author_image
      },
      tags: config.keywords
    }
  })

  res.status(200)
  res.send(feed)
})

export default router

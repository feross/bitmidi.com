const express = require('express')

const api = require('../api')
const config = require('../../config')
const { oneLine } = require('common-tags')

const router = express.Router()

router.get('/feed.xml', (req, res, next) => {
  api.snippet.all(req.query, (err, snippets) => {
    if (err) return res.sendStatus(500)

    res.status(200)
    res.render('feed', {
      snippets
    })
  })
})

router.get('/feed.json', (req, res, next) => {
  api.snippet.all(req.query, (err, snippets) => {
    if (err) return res.sendStatus(500)

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

    feed.items = snippets.map(snippet => {
      return {
        id: snippet.url,
        url: snippet.url,
        title: snippet.name,
        content_html: snippet.html,
        content_text: snippet.code,
        summary: snippet.name,
        // date_published: '', // TODO
        // date_modified: '', // TODO
        author: {
          name: `@${snippet.author}`,
          url: snippet.author_url,
          avatar: snippet.author_image
        },
        tags: config.keywords
      }
    })

    res.status(200).send(feed)
  })
})

module.exports = router

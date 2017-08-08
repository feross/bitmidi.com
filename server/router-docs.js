const express = require('express')

const api = require('./api')

const routerDocs = express.Router()

routerDocs.use('/docs', (req, res, next) => {
  const opts = {
    url: req.url
  }
  api.doc(opts, (err, doc) => {
    if (err && err.code === 'ENOENT') return next() // 404
    else if (err) return next(err)

    // res.render('index', { content: doc })
    res.render('index')
  })
})

module.exports = routerDocs

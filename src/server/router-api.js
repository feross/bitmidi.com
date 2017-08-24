const express = require('express')

const api = require('../api')

const router = express.Router()

router.get('/doc/get', (req, res, next) => {
  api.doc.get(req.query, (err, result) => {
    if (err) {
      err.status = 404
      return next(err)
    }
    res.json({ result })
  })
})

router.get('/snippet/get', (req, res, next) => {
  api.snippet.get(req.query, (err, result) => {
    if (err) {
      err.status = 404
      return next(err)
    }
    res.json({ result })
  })
})

router.get('/snippet/all', (req, res, next) => {
  api.snippet.all(req.query, (err, result) => {
    if (err) {
      err.status = 404
      return next(err)
    }
    res.json({ result })
  })
})

router.post('/snippet/add', (req, res, next) => {
  if (!req.session.user) {
    return next(new Error('Must be logged in to add snippets'))
  }

  const opts = Object.assign({}, req.query, {
    author: req.session.user.userName
  })

  api.snippet.add(opts, (err, result) => {
    if (err) {
      err.status = 404
      return next(err)
    }
    res.json({ result })
  })
})

router.get('*', (req, res, next) => {
  const err = new Error('404 Not Found')
  err.status = 404
  next(err)
})

if (global.opbeat) router.use(global.opbeat.middleware.express())

router.use((err, req, res, next) => {
  const status = typeof err.status === 'number' ? err.status : 400 // Bad Request
  res.status(status)
  res.json({ error: err.message })
})

module.exports = router

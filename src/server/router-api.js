const express = require('express')

const api = require('../api')

const router = express.Router()

function sendError (next, err, opts) {
  Object.assign(err, opts)
  return next(err)
}

router.get('/doc/get', (req, res, next) => {
  api.doc.get(req.query, (err, result) => {
    if (err) return sendError(next, err, { status: 404 })
    res.json({ result })
  })
})

router.get('/snippet/get', (req, res, next) => {
  api.snippet.get(req.query, (err, result) => {
    if (err) return sendError(next, err, { status: 404 })
    res.json({ result })
  })
})

router.get('/snippet/all', (req, res, next) => {
  api.snippet.all(req.query, (err, result) => {
    if (err) return sendError(next, err, { status: 404 })
    res.json({ result })
  })
})

router.post('/snippet/add', (req, res, next) => {
  if (!req.session.user) {
    return sendError(next, new Error('Must be logged in to add snippets'), {
      code: 'LOGGED_OUT',
      status: 403 // Forbidden
    })
  }

  const snippet = Object.assign({}, req.query, {
    author: req.session.user.userName
  })

  api.snippet.add(snippet, (err, result) => {
    if (err) return sendError(next, err)
    res.json({ result })
  })
})

router.post('/snippet/vote', (req, res, next) => {
  const voter = req.session.user
    ? req.session.user.userName
    : req.ip

  const opts = Object.assign({}, req.query, { voter })

  api.snippet.vote(opts, (err, result) => {
    if (err) return sendError(next, err)
    res.json({ result })
  })
})

router.get('/snippet/search', (req, res, next) => {
  api.snippet.search(req.query, (err, result) => {
    if (err) return sendError(next, err, { status: 404 })
    res.json({ result })
  })
})

router.get('/twitter/getUser', (req, res, next) => {
  api.twitter.getUser(req.query, (err, result) => {
    if (err) return sendError(next, err, { status: 404 })
    res.json({ result })
  })
})

router.get('*', (req, res, next) => {
  const err = new Error('404 Not Found')
  sendError(next, err, { status: 404 })
})

if (global.opbeat) router.use(global.opbeat.middleware.express())

router.use((err, req, res, next) => {
  const status = typeof err.status === 'number' ? err.status : 400 // Bad Request
  res.status(status)
  res.json({ error: { message: err.message, code: err.code } })
})

module.exports = router

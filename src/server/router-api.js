const express = require('express')

const api = require('../api')

const router = express.Router()

router.use('/:method', (req, res, next) => {
  const method = api[req.params.method]
  if (typeof method !== 'function') return next()
  method(req.query, (err, result) => {
    if (err) {
      err.status = 404
      return next(err)
    }
    res.json({ result })
  })
})

router.get('*', (req, res) => {
  res.status(404)
  res.json({ error: '404 Not Found' })
})

if (global.opbeat) router.use(global.opbeat.middleware.express())

router.use((err, req, res, next) => {
  const status = typeof err.status === 'number' ? err.status : 400 // Bad Request
  res.status(status)
  res.json({ error: err.message })
})

module.exports = router

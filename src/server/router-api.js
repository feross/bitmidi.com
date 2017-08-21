const express = require('express')

const apis = require('../api')

const router = express.Router()

// APIs are mounted as GET endpoints, except for the POST endpoints listed here
const POST_APIS = new Set([
  'snippet.add'
])

router.use('/:api/:method', (req, res, next) => {
  const api = apis[req.params.api]
  if (api == null || typeof api !== 'object') return next()

  const method = api[req.params.method]
  if (typeof method !== 'function') return next()

  const methodSignature = req.params.api + '.' + req.params.method
  if (POST_APIS.has(methodSignature) && req.method !== 'POST') {
    return next(new Error('Route requires a POST request'))
  }

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

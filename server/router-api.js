const express = require('express')

const api = require('./api')

const routerApi = express.Router()

routerApi.use('/:method', (req, res, next) => {
  const method = api[req.params.method]
  if (typeof method !== 'function') return next()
  method(req.query, (err, result) => {
    if (err) return next(err)
    res.json({ result })
  })
})

routerApi.get('*', (req, res) => {
  res.status(404).json({ error: '404 Not Found' })
})

if (global.opbeat) {
  routerApi.use(global.opbeat.middleware.express())
}

routerApi.use((err, req, res, next) => {
  const status = typeof err.status === 'number' ? err.status : 400 // 'Bad Request'
  return res.status(status).json({ error: err.message })
})

module.exports = routerApi

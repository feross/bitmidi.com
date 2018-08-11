import Router from 'express-promise-router'

import api from '../api'

const router = Router()

router.get('/api/midi/get', async (req, res) => {
  res.json({ result: await api.midi.get(req.query) })
})

router.get('/api/midi/play', async (req, res) => {
  res.json({ result: await api.midi.play(req.query) })
})

router.get('/api/midi/all', async (req, res) => {
  res.json({ result: await api.midi.all(req.query) })
})

router.get('/api/midi/search', async (req, res) => {
  res.json({ result: await api.midi.search(req.query) })
})

router.get('/api/midi/random', async (req, res) => {
  res.json({ result: await api.midi.random(req.query) })
})

router.get('*', async (req, res) => {
  const err = new Error('404 Not Found')
  err.status = 404
  throw err
})

if (global.rollbar) router.use(global.rollbar.errorHandler())

router.use(async (err, req, res, next) => {
  console.error(err.stack)
  const status = typeof err.status === 'number' ? err.status : 400 // Bad Request
  res.status(status)
  res.json({ error: { message: err.message, code: err.code } })
})

export default router

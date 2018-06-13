import Router from 'express-promise-router'

import api from '../api'

const router = Router()

router.get('/midi/get', async (req, res) => {
  res.json({ result: await api.midi.get(req.query) })
})

router.get('/midi/all', async (req, res) => {
  res.json({ result: await api.midi.all(req.query) })
})

router.get('/midi/search', async (req, res) => {
  res.json({ result: await api.midi.search(req.query) })
})

router.get('/midi/random', async (req, res) => {
  res.json({ result: await api.midi.random(req.query) })
})

router.get('*', async (req, res) => {
  const err = new Error('404 Not Found')
  err.status = 404
  throw err
})

if (global.opbeat) router.use(global.opbeat.middleware.express())

router.use(async (err, req, res, next) => {
  const status = typeof err.status === 'number' ? err.status : 400 // Bad Request
  res.status(status)
  res.json({ error: { message: err.message, code: err.code } })
})

export default router

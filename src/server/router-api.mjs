import cors from 'cors'
import Router from 'express-promise-router'
import {
  ValidationError,
  NotFoundError,
  DBError,
  ConstraintViolationError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError
} from 'objection'

import api from '../api'

const router = Router()

router.get('/midi/get', cors(), async (req, res) => {
  res.json({ result: await api.midi.get(req.query) })
})

router.get('/midi/play', async (req, res) => {
  res.json({ result: await api.midi.play(req.query) })
})

router.get('/midi/all', async (req, res) => {
  res.json({ result: await api.midi.all(req.query) })
})

router.get('/midi/search', cors(), async (req, res) => {
  res.json({ result: await api.midi.search(req.query) })
})

router.get('/midi/random', async (req, res) => {
  res.json({ result: await api.midi.random(req.query) })
})

router.all('*', async (req, res) => {
  const err = new Error('404 Not Found')
  err.status = 404
  throw err
})

if (global.rollbar) router.use(global.rollbar.errorHandler())

router.use(async (err, req, res, next) => {
  augmentObjectionError(err)

  const { message, stack, code = null, status = null } = err
  console.error(stack)

  res
    .status(Number(err.status) || 500)
    .json({ error: { message, code, status } })
})

function augmentObjectionError (err, res) {
  if (err instanceof ValidationError) {
    err.status = 400
    err.code = err.type || 'UnknownValidationError'
  } else if (err instanceof NotFoundError) {
    err.status = 404
    err.code = 'NOT_FOUND'
  } else if (err instanceof UniqueViolationError) {
    err.status = 409
    err.code = 'UNIQUE_VIOLATION'
  } else if (err instanceof NotNullViolationError) {
    err.status = 400
    err.code = 'NOT_NULL_VIOLATION'
  } else if (err instanceof ForeignKeyViolationError) {
    err.status = 409
    err.code = 'FOREIGN_KEY_VIOLATION'
  } else if (err instanceof CheckViolationError) {
    err.status = 400
    err.code = 'CHECK_VIOLATION'
  } else if (err instanceof ConstraintViolationError) {
    err.status = 409
    err.code = 'UNKNOWN_CONSTRAINT_VIOLATION'
  } else if (err instanceof DataError) {
    err.status = 400
    err.code = 'UNKNOWN_DATA_ERROR'
  } else if (err instanceof DBError) {
    err.status = 500
    err.code = 'UNKNOWN_DB_ERROR'
  } else {
    err.status = 500
    err.code = 'UNKNOWN_ERROR'
  }
}

export default router

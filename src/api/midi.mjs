import Debug from 'debug'

import Midi from '../models/midi'

const debug = Debug('bitmidi:api:midi')

const SELECT_MINIMAL = ['id', 'name', 'slug']
const PAGE_SIZE = 10

async function get (query = {}) {
  debug('get %o', query)
  const result = await Midi
    .query()
    .findOne(query)
    .throwIfNotFound()

  await result
    .$query()
    .increment('views', 1)

  return { query, result }
}

async function play (query = {}) {
  debug('play %o', query)
  await Midi
    .query()
    .findOne(query)
    .throwIfNotFound()
    .increment('plays', 1)
  return { query }
}

async function all (query = {}) {
  query.page = Number(query.page) || 0
  debug('all %o', query)
  const { total, results } = await Midi
    .query()
    .select(SELECT_MINIMAL)
    .orderBy('plays', 'desc')
    .page(query.page, PAGE_SIZE)
  return { query, results, total, pageTotal: getPageTotal(total) }
}

async function search (query = {}) {
  query.page = Number(query.page) || 0
  debug('search %o', query)
  const select = [].concat(
    SELECT_MINIMAL,
    Midi.raw('MATCH(name) AGAINST(? IN BOOLEAN MODE) as score', query.q)
  )
  const { total, results } = await Midi
    .query()
    .select(select)
    .page(query.page, PAGE_SIZE)
    .whereRaw('MATCH(name) AGAINST(? IN BOOLEAN MODE)', query.q)
  return { query, results, total, pageTotal: getPageTotal(total) }
}

async function random (query = {}) {
  const result = await Midi
    .query()
    .orderByRaw('RAND()')
    .findOne({})
  return { query, result }
}

function getPageTotal (total) {
  return Math.ceil(total / PAGE_SIZE)
}

export default { get, play, all, search, random }

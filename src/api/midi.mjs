import Debug from 'debug'

import Midi from '../models/midi'

const debug = Debug('bitmidi:api:midi')

const SELECT_MINIMAL = ['id', 'name']
const PAGE_SIZE = 10

async function get (query = {}) {
  debug('get %o', query)
  const result = await Midi
    .query()
    .findOne(query)
    .throwIfNotFound()
  return { query, result }
}

async function all (query = {}) {
  query.page = Number(query.page) || 0
  debug('all %o', query)
  const { total, results } = await Midi
    .query()
    .select(SELECT_MINIMAL)
    .page(query.page, PAGE_SIZE)
  return { query, results, total: getPages(total) }
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
  return { query, results, total: getPages(total) }
}

async function random (query = {}) {
  const result = await Midi
    .query()
    .orderByRaw('RAND()')
    .findOne({})
  return { query, result }
}

function getPages (total) {
  return Math.ceil(total / PAGE_SIZE)
}

export default { get, all, search, random }

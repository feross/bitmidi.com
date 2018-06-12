import Debug from 'debug'

import Midi from '../models/midi'

const debug = Debug('bitmidi:api:midi')

const SELECT = ['id', 'name']
const PAGE_SIZE = 10

async function get (query = {}) {
  debug('get %o', query)
  const result = await Midi
    .query()
    .select(SELECT)
    .findOne(query)
    .throwIfNotFound()
  return { query, result }
}

async function all (query = {}) {
  debug('all %o', query)
  const result = await Midi
    .query()
    .select(SELECT)
    .page(query.page, PAGE_SIZE)
  return { query, ...result }
}

async function search (query = {}) {
  debug('search %o', query)
  const select = [].concat(
    SELECT,
    Midi.raw('MATCH(name) AGAINST(? IN BOOLEAN MODE) as score', query.q)
  )
  const result = await Midi
    .query()
    .select(select)
    .page(query.page, PAGE_SIZE)
    .whereRaw('MATCH(name) AGAINST(? IN BOOLEAN MODE)', query.q)
  return { query, ...result }
}

export default { get, all, search }

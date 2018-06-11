import Debug from 'debug'

import Midi from '../models/midi'

const debug = Debug('bitmidi:api:midi')

const DEFAULT_SELECT = ['id', 'name']

async function get (opts = {}) {
  debug('get %o', opts)
  const midis = await Midi
    .query()
    .select(opts.select || DEFAULT_SELECT)
    .where(opts)
    .limit(1)
    .throwIfNotFound()
  return { ...opts, midi: midis[0] }
}

async function all (opts = {}) {
  debug('all %o', opts)
  const midis = await Midi
    .query()
    .select(opts.select || DEFAULT_SELECT)
    .limit(opts.limit || 10)
  return { ...opts, midis }
}

async function search (opts = {}) {
  debug('search %o', opts)
  const select = (opts.select || DEFAULT_SELECT)
    .concat(Midi.raw('MATCH(name) AGAINST(? IN BOOLEAN MODE) as score', opts.q))
  const midis = await Midi
    .query()
    .select(select)
    .limit(opts.limit || 10)
    .whereRaw('MATCH(name) AGAINST(? IN BOOLEAN MODE)', opts.q)
  return { ...opts, midis }
}

export default { get, all, search }

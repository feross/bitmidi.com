import Debug from 'debug'

import Midi from '../models/midi'

const debug = Debug('bitmidi:api:midi')

async function get (opts) {
  debug('get %o', opts)
  const midis = await Midi
    .query()
    .where('id', opts.id)
    .limit(1)
    .throwIfNotFound()
  return midis[0]
}

async function all (opts) {
  debug('all %o', opts)
  return Midi
    .query()
    .throwIfNotFound()
}

export default { get, all }

import Debug from 'debug'

import Midi from '../models/midi'

const debug = Debug('bitmidi:api:midi')

async function get (opts) {
  debug('get %o', opts)
  const midis = await Midi
    .query()
    .where(opts)
    .limit(1)
    .throwIfNotFound()
  return midis[0]
}

async function all (opts) {
  debug('all %o', opts)
  return Midi
    .query()
    .limit(100)
    .throwIfNotFound()
}

export default { get, all }

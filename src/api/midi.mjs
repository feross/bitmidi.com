import Debug from 'debug'

import Midi from '../models/midi'

const debug = Debug('bitmidi:api:midi')

export async function get (opts) {
  debug('get %o', opts)
  const midis = await Midi
    .query()
    .where('id', opts.id)
    .limit(1)
    .throwIfNotFound()
  return midis[0]
}

export async function all (opts) {
  debug('all %o', opts)
  return Midi
    .query()
    .throwIfNotFound()
}

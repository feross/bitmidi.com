import Debug from 'debug'

import Reddit from '../lib/reddit'
import Midi from '../models/midi'
import { origin, apiUserAgent } from '../config'
import { reddit as redditSecret } from '../../secret'

const debug = Debug('bitmidi:share-reddit')
const reddit = new Reddit({ userAgent: apiUserAgent, ...redditSecret })

export default async function shareReddit () {
  const midi = await Midi
    .query()
    .orderBy('plays', 'desc')
    .findOne({ sharedReddit: false })

  const title = midi.name
  const url = `${origin}${midi.url}`

  await queueReddit(title, url)

  await midi
    .$query()
    .patch({ sharedReddit: true })

  debug('Shared reddit post: %s %s', title, url)
}

async function queueReddit (title, url) {
  const opts = {
    sr: 'bitmidi',
    kind: 'link',
    resubmit: true,
    title: title,
    url: url
  }
  await reddit.post('/api/submit', opts)
}

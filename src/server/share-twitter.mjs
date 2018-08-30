import Debug from 'debug'
import get from 'simple-get'

import Midi from '../models/midi'
import stripIndent from 'common-tags/lib/stripIndent'
import { origin, apiUserAgent } from '../config'
import { buffer as bufferSecret } from '../../secret'

const debug = Debug('bitmidi:share-twitter')

const BUFFER_API = 'https://api.bufferapp.com/1/updates/create.json'

const POSTS = [
  stripIndent`
    🚨 NEW MIDI ALERT! 🚨

    Get it while it's hot! 🔥 MIDI_NAME is soooo goood.

    MIDI_URL
  `,
  stripIndent`
    🎵 IT'S MIDI TIME 🎵

    Today's MIDI is MIDI_NAME ✨

    MIDI_URL
  `,
  stripIndent`
    📬 YOU'VE GOT MAIL 📨

    There's a fresh MIDI in your inbox! It's MIDI_NAME! 💌

    MIDI_URL
  `,
  stripIndent`
    📼 COMING SOON ON VIDEOCASSETTE 📼

    BitMidi presents MIDI_NAME, now available to own on VHS ⭐️

    Be kind, please rewind. 📼

    MIDI_URL
  `,
  stripIndent`
    📦 YOUR MIDI SHIPMENT HAS ARRIVED 📦

    MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🐢💧 A WILD MIDI APPEARED! 🐸🔥

    It's MIDI_NAME!

    Listening to the MIDI was super effective! ✨

    MIDI_URL
  `,
  stripIndent`
    🎼 FRESH MIDI GOODNESS 🎹

    This ish is so phat: MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    💽 💾 PARTY LIKE IT'S 1999 💿 📀

    Don't be trippin' home skillet! 🍳 We got a MIDI for you that is all that and a bag of potato chips! 🥔

    MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    📞 WE GOT THE 4-1-1 ☎️

    It's a new MIDI every day. Today's MIDI is MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    ⭐️ MIDI-CHLORIAN READINGS OFF THE CHART 📈

    Even Master Yoda doesn't have a MIDI-chlorian count as high as this track:

    MIDI_NAME

    It's a trap: MIDI_URL
  `,
  stripIndent`
    🎺 🎸 PARTY TIME 🎷 🥁

    The MIDI of the Day is MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🌟 MIDI of the Day™ 🌟

    Listen to it here: MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🌶🌶 THIS MIDI IS HOTTTT 🌶🌶

    MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🔥 THIS MIDI IS LIT 🔥

    🚒 Someone call the firefighters! 👨‍🚒 👩‍🚒

    MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    ✨ BRAND NEW MIDI ✨

    This MIDI will make you go 🙌

    MIDI_NAME

    MIDI_URL
  `
]

export default async function shareTwitter () {
  let midi = await Midi
    .query()
    .orderBy('plays', 'desc')
    .findOne({ sharedTwitter: false })

  const text = getPostText(midi)
  await queueTweet(text)

  await midi
    .$query()
    .patch({ sharedTwitter: true })

  debug('Shared tweet: %s', text)
}

function getPostText (midi) {
  const postIndex = Math.floor(Math.random() * POSTS.length)
  let post = POSTS[postIndex]
  return post
    .replace(/MIDI_NAME/g, midi.name)
    .replace(/MIDI_URL/g, `${origin}${midi.url}`)
}

function queueTweet (text) {
  return new Promise((resolve, reject) => {
    get.concat({
      url: BUFFER_API,
      method: 'POST',
      json: true,
      timeout: 30 * 1000,
      headers: {
        'user-agent': apiUserAgent
      },
      form: {
        access_token: bufferSecret.accessToken,
        profile_ids: [bufferSecret.profileId],
        text,
        top: true
      }
    }, (err, res, body) => {
      if (err) return reject(err)
      if (res.statusCode !== 200) {
        return reject(new Error(`Non-200 status code: ${res.statusCode}`))
      }
      if (!body.success) {
        return reject(new Error(`Buffer API error: ${body.message}`))
      }
      resolve()
    })
  })
}

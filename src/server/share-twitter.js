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

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🔥 Get it while it's hot! 🔥

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🎺 IT'S MIDI TIME 🎺

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    ✨ Today's MIDI is... ✨

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    📬 YOU'VE GOT MAIL 📬

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    💌 Fresh MIDI in your inbox! 💌

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    📼 Coming Soon On Videocassette 📼

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    📼 Be kind, please rewind. 📼

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    📦 YOUR MIDI SHIPMENT HAS ARRIVED 📦

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🐢💧 A WILD MIDI APPEARED! 🐸🔥

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    ✨ Listening to this MIDI was super effective! ✨

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🎹 Fresh MIDI Goodness 🎹

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    💿 Party Like It's 1999 💿

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🍳 Don't be trippin' home skillet! 🍳

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🥔 This MIDI is all that and a bag of potato chips! 🥔

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    ☎️ WE GOT THE 4-1-1 ☎️

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    📅 A new MIDI every day 📅

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    📈 MIDI CHLORIAN READINGS OFF THE CHART 📈

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    Impressed with the MIDI chlorian counts, yoda is. Hmmmmmm.

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🎺 🎸 PARTY TIME 🎷 🥁

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🌟 MIDI of the Day 🌟

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🤩 MIDI of the Day 🤩

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    😍 MIDI of the Day 😍

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🥳 MIDI of the Day 🥳

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🎉 MIDI of the Day 🎉

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🎶 A new MIDI every day 🎶

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🌶 THIS MIDI IS HOTTTT 🌶

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🚒 Someone call the firefighters! 👨‍🚒

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    ✨ Brand New MIDI ✨

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    🙌 This MIDI will make you go wild 🙌

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    👀 This MIDI starts out good but you won't believe what happens next 👀

    🎵 MIDI_NAME

    MIDI_URL
  `,
  stripIndent`
    💰 One weird MIDI file trick – MP3 files HATE this file! 💰

    🎵 MIDI_NAME

    MIDI_URL
  `
]

export default async function shareTwitter () {
  const midi = await Midi
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
  const post = POSTS[postIndex]
  return post
    .replace(/MIDI_NAME/g, midi.name)
    .replace(/MIDI_URL/g, `${origin}${midi.url}`)
}

async function queueTweet (text) {
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
      if (err) return reject(new Error(`Failed to queue tweet: ${err.message}`))
      if (res.statusCode !== 200) {
        return reject(new Error(`Non-200 status code: ${res.statusCode}. ${body.error || body.message}`))
      }
      if (!body.success) {
        return reject(new Error(`Buffer API error: ${body.error || body.message}`))
      }
      resolve()
    })
  })
}

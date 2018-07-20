import { h } from 'preact' /** @jsx h */

import config from '../config'
import { doMidiAll } from '../actions/midi'

import Loader from './loader'
import Heading from './heading'
import Page from './page'

export default class AboutPage extends Page {
  async load () {
    const { dispatch } = this.context

    dispatch('APP_META', {
      title: `About ${config.title}`
    })

    await dispatch(doMidiAll({ pageSize: 1 }))
  }

  render (props) {
    if (!this.loaded) return <Loader center />

    const { views } = this.context.store

    return (
      <div>
        <Heading>About {config.title}</Heading>
        <p>Serving {views.all.total.toLocaleString()} MIDI files curated by volunteers around the world.</p>

        <Heading>What is this site?</Heading>
        <p>
          I found a ZIP file with 100K+ MIDI files and tried to play it back, but was was disappointed to discover that most software doesn't playing back MIDI files anymore. :disappointed: Browsers have removed native support, QuickTime stopped supporting it, even the venerable VLC can't play it back. There were some websites that offered playback and a library of files to choose from, but they were missing many instruments or they were flash-based and not long for this world. So, I compiled the best MIDI player written in C to WebAssembly and put a frontend on it, so it's easy to browse. That's BitMidi.
        </p>

        <Heading>What are MIDI files?</Heading>
        <p>TODO</p>

      </div>
    )
  }
}

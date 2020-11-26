
import { siteName } from '../config'
import { doMidiAll } from '../actions/midi'

import Heading from './heading'
import Link from './link'
import Loader from './loader'
import Page from './page'

export default class AboutPage extends Page {
  async load () {
    const { dispatch } = this.context

    await dispatch(doMidiAll({ pageSize: 1 }))

    dispatch('APP_META', {
      title: `About ${siteName}`
    })
  }

  render (props, _, { store }) {
    const { views } = store

    if (!this.loaded) return <Loader center />

    return (
      <div>
        <Heading>About {siteName}</Heading>
        <p>Serving {views.all.total.toLocaleString()} MIDI files curated by volunteers around the world.</p>

        <Heading>What is this site?</Heading>
        <p>
          I was reminiscing about the days of Geocities and Angelfire, back when the web was quirky and fun. I remembered how sites used to use the <code>&lt;bgsound&gt;</code> tag to include an autoplaying background MIDI file. Those files had such a nice, old-school aesthetic.
        </p>
        <p>
          I wanted to hear some MIDIs, so I searched and found a .zip file with 100K+ MIDI files that someone posted to Reddit. I tried playing a few in Chrome, Firefox, Safari, etc. and then realized that they've all dropped the <code>&lt;bgsound&gt;</code> tag. Even Quicktime and VLC couldn't play back the files.*
        </p>
        <p>
          There were some websites that could convert MIDI to low-quality MP3, and technically Apple still offers Quicktime 7 for download which can play MIDI, but it wasn't easy or fun to do.
        </p>
        <p>
          Some websites offered inline playback with Flash (but it was flaky and hard to get working in Chrome), and the JS-based ones were missing many instruments or multi-MB Emscripten-compiled monstrosities!
        </p>
        <p>
          I decided that I'd compile the best MIDI player written in C (libtimidity) to WebAssembly and put in lots of effort to optimize the bundle and include the minimal amount of code. The result of that is the <Link href='https://github.com/feross/timidity'>timidity</Link> library. It's quite lightweight - just 34 KB of JavaScript and 23 KB of lazy-loaded WebAssembly.
        </p>
        <p>
          Then I put a frontend on it, so it's easy to browse that .zip file's contents. And that's BitMidi.
        </p>
        <p>
          I plan to ingest a lot more MIDI files in the future, perhaps from the Geocities MIDI archive on the Internet Archive.
        </p>
        <p>
          Feedback welcome!
        </p>
        <p>
          <small>* I later learned that VLC can actually play most MIDIs and I just got unlucky with the few I tried! That's okay though – I got to learn a lot about MIDI files, Emscripten, WebAssembly, and modern front-end web techniques.</small>
        </p>
      </div>
    )
  }
}

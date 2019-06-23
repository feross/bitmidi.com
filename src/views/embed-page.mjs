import { h } from 'preact' /** @jsx h */
import oneLine from 'common-tags/lib/oneLine'

import { siteName } from '../config'
import { doMidiGet } from '../actions/midi'

import Loader from './loader'
import Midi from './midi'
import Page from './page'

export default class EmbedPage extends Page {
  static showAppShell = false

  async load () {
    const { store, dispatch } = this.context
    const { midiSlug } = store.location.params

    const { result: midi } = await dispatch(doMidiGet({ slug: midiSlug }))

    if (midiSlug.toLowerCase() !== midiSlug) {
      return dispatch('LOCATION_REPLACE', midi.url)
    }

    dispatch('APP_META', {
      title: midi.name,
      description: oneLine`
        Listen to ${midi.name}, a free MIDI file on ${siteName}. Play, download, or share the MIDI song ${midi.name} from your web browser.
      `,
      image: midi.image
    })
  }

  render (props, _, { store }) {
    const { data } = store
    const { midiSlug } = store.location.params

    if (!this.loaded) {
      return <Loader center label={`Loading ${midiSlug}`} />
    }

    const midi = data.midis[midiSlug]

    return (
      <div>
        <Midi midi={midi} showImage={false} />
      </div>
    )
  }
}

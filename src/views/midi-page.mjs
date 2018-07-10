import { h } from 'preact' /** @jsx h */

import { doMidiGet } from '../actions/midi'

import Heading from './heading'
import Link from './link'
import Loader from './loader'
import Midi from './midi'
import PageComponent from './page-component'

export default class MidiPage extends PageComponent {
  async load () {
    const { store, dispatch } = this.context
    const { midiSlug } = store.location.params

    const { result } = await dispatch(doMidiGet({ slug: midiSlug }))

    dispatch('APP_META', {
      title: result.name,
      description: `Listen to ${result.name}`
    })
  }

  render (props) {
    const { store } = this.context
    const { data } = store
    const { midiSlug } = store.location.params

    const midi = data.midis[midiSlug]

    if (midi == null) return <Loader center />

    return (
      <div>
        <Heading>{midi.name}</Heading>
        <Midi midi={midi} />
        <h3>Download</h3>
        <Link download={midi.name} href={midi.downloadUrl}>
          Download {midi.name}
        </Link>
        <h3>Stats</h3>
        <ul>
          <li>The MIDI file <strong>{midi.name}</strong> has been played {midi.plays} times.</li>
          <li>This page has been viewed {midi.views} times.</li>
        </ul>
        { midi.alternateNames &&
          <h3>This MIDI file has also been seen with other names:</h3>
        }
        <ul>
          {
            midi.alternateNames && midi.alternateNames.map(name => {
              return <li>{name}</li>
            })
          }
        </ul>
      </div>
    )
  }
}

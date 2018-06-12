import { h } from 'preact' /** @jsx h */

import Heading from './heading'
import Loader from './loader'
import Midi from './midi'
import PageComponent from './page-component'

export default class MidiPage extends PageComponent {
  load () {
    const { dispatch } = this.context
    const { location } = this.context.store
    const { midiId } = location.params

    dispatch('API_MIDI_GET', { id: midiId })
    dispatch('APP_META', { title: 'TODO', description: 'TODO' })
  }

  render (props) {
    const { store } = this.context
    const { data, location } = store
    const { midiId } = location.params

    const midi = data.midis[midiId]

    if (midi == null) return <Loader center />

    return (
      <div>
        <Heading>{midi && midi.name}</Heading>
        <Midi midi={midi} />
        {
          midi.alternateNames &&
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

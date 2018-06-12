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
    return (
      <Loader show={midi == null} center>
        <Heading>{midi && midi.name}</Heading>
        <Midi midi={midi} />
      </Loader>
    )
  }
}

import { h } from 'preact' /** @jsx h */

import Heading from './heading'
import Loader from './loader'
import Midi from './midi'
import PageComponent from './page-component'

export default class HomePage extends PageComponent {
  load () {
    const { dispatch } = this.context
    dispatch('APP_META', { title: null, description: null })
    dispatch('API_MIDI_ALL')
  }

  render (props) {
    const { topMidiIds, midis } = this.context.store

    const topMidis = topMidiIds &&
      topMidiIds.map(midiId => midis[midiId])

    return (
      <Loader show={topMidiIds.length === 0} center>
        <Heading class='tc'>Most popular MIDIs</Heading>
        {topMidis && topMidis.map(midi => <Midi midi={midi} />)}
      </Loader>
    )
  }
}

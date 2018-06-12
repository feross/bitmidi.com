import { h } from 'preact' /** @jsx h */

import Heading from './heading'
import Loader from './loader'
import Midi from './midi'
import PageComponent from './page-component'

export default class HomePage extends PageComponent {
  load () {
    const { dispatch } = this.context
    const { location } = this.context.store
    const { page } = location.query

    dispatch('APP_META', { title: null, description: null })
    dispatch('API_MIDI_ALL', { page })
  }

  render (props) {
    const { allMidiIds, midis, location } = this.context.store
    const { page } = location.query

    const midiIds = allMidiIds[page]
    const results = midiIds && midiIds.map(midiId => midis[midiId])

    return (
      <div>
        <Heading class='tc'>Most popular MIDIs</Heading>
        <Loader show={!results} center>
          {results && results.map(midi => <Midi midi={midi} />)}
        </Loader>
      </div>
    )
  }
}

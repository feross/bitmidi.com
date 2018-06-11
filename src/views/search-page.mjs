import { h } from 'preact' /** @jsx h */

import Heading from './heading'
import Loader from './loader'
import PageComponent from './page-component'
import Midi from './midi'

export default class SearchPage extends PageComponent {
  load () {
    const { dispatch } = this.context
    const { location } = this.context.store
    const { q } = location.query

    dispatch('APP_META', {
      title: `MIDIs containing '${q}'`,
      description: `Search results page for MIDI files that contain '${q}'`
    })
    dispatch('API_MIDI_SEARCH', { q })
  }

  render (props) {
    const { location, searches, midis } = this.context.store
    const q = location.query.q

    const search = searches[q]
    const results = search && search.map(midiId => midis[midiId])

    return (
      <Loader show={search == null} center>
        <Heading><span class='light-silver'>Search for</span> '{q}'</Heading>
        { results && results.map(midi => <Midi midi={midi} />) }
        { results && results.length === 0 && <div class='mt4'>No results.</div> }
      </Loader>
    )
  }
}

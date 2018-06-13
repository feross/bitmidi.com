import { h } from 'preact' /** @jsx h */

import Heading from './heading'
import Loader from './loader'
import PageComponent from './page-component'
import Pagination from './pagination'
import Midi from './midi'

export default class SearchPage extends PageComponent {
  load () {
    const { dispatch } = this.context
    const { location } = this.context.store
    const { q, page } = location.query

    let title = [`MIDIs containing '${q}'`]
    if (page !== '0') title.unshift(`Page ${page}`)
    dispatch('APP_META', {
      title,
      description: `Search results page for MIDI files that contain '${q}'`
    })
    dispatch('API_MIDI_SEARCH', { q, page })
  }

  render (props) {
    const { data, location, views } = this.context.store
    const { q, page } = location.query

    const search = views.search[q]
    const total = search && search.total
    const results = search && search[page]
      ? search[page].map(midiId => data.midis[midiId])
      : []

    return (
      <div>
        <Heading><span class='light-silver'>Search for</span> '{q}'</Heading>
        <Loader show={!search} center>
          { results.map(midi => <Midi midi={midi} />) }
          {
            results.length === 0 &&
            <div class='mt4'>
              No results containing all your search terms were found.
            </div>
          }
          <Pagination page={page} total={total} />
        </Loader>
      </div>
    )
  }
}

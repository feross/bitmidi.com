import { h } from 'preact' /** @jsx h */

import { doMidiSearch } from '../actions/midi'

import Heading from './heading'
import Loader from './loader'
import PageComponent from './page-component'
import Pagination from './pagination'
import Midi from './midi'

export default class SearchPage extends PageComponent {
  async load () {
    const { store, dispatch } = this.context
    const { q, page } = store.location.query

    await dispatch(doMidiSearch({ q, page }))

    const title = [`MIDIs containing '${q}'`]
    if (page !== '0') title.unshift(`Page ${page}`)

    dispatch('APP_META', {
      title,
      description: `Search results page for MIDI files that contain '${q}'`
    })
  }

  render (props) {
    const { data, location, views } = this.context.store
    const { q, page } = location.query

    if (!this.loaded) {
      return <Loader center label={`Searching for ${q}`} />
    }

    const search = views.search[q]
    const pageTotal = search && search.pageTotal
    const total = search && search.total
    const results = search && search[page]
      ? search[page].map(midiSlug => data.midis[midiSlug])
      : []

    return (
      <div>
        <Heading><span class='silver'>Search for</span> '{q}'</Heading>
        { results.map(midi => <Midi midi={midi} />) }
        {
          results.length === 0 &&
          <div class='mt4'>
            No results with your search terms were found.
          </div>
        }
        <Pagination page={page} pageTotal={pageTotal} total={total} />
      </div>
    )
  }
}

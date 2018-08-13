import { h } from 'preact' /** @jsx h */

import { doMidiSearch } from '../actions/midi'

import Heading from './heading'
import Loader from './loader'
import Page from './page'
import Pagination from './pagination'
import Midi from './midi'

export default class SearchPage extends Page {
  async load () {
    const { store, dispatch } = this.context
    const { q, page } = store.location.query

    await dispatch(doMidiSearch({ q, page }))

    const meta = {
      title: [`MIDIs containing '${q}'`],
      description: [`Search results page for MIDI files that contain '${q}'.`]
    }
    if (page !== '0') {
      const pageStr = `Page ${page}`
      meta.title.unshift(pageStr)
      meta.description.unshift(pageStr)
    }
    dispatch('APP_META', meta)
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
        <Heading><span class='gray'>Search for</span> '{q}'</Heading>
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

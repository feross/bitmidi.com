/** @jsx h */
import { h, Fragment } from 'preact'

import { doMidiSearch } from '../actions/midi'

import Heading from './heading'
import Loader from './loader'
import Midi from './midi'
import Page from './page'
import Pagination from './pagination'
import { MidiFeedTopAd, MidiFeedAd } from './ads'

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

  render (props, _, { store }) {
    const { data, location, views } = store
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

        <Heading><span class='mid-gray'>Search for</span> '{q}'</Heading>

        <div class='mv4'>
          {results.map((midi, i) =>
            <Fragment key={midi.slug}>
              <Midi midi={midi} showImage={false} showPlay={false} />
              {i === 2 && page !== '0' && <MidiFeedTopAd class='center' />}
              {i % 9 === 0 && page !== '0' && <MidiFeedAd class='center' />}
            </Fragment>
          )}
          {
            results.length === 0 &&
              <span>
                No results with your search terms were found.
              </span>
          }
        </div>

        <Pagination page={page} pageTotal={pageTotal} total={total} />
      </div>
    )
  }
}

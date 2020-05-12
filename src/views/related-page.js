/** @jsx h */
import { h, Fragment } from 'preact'

import { doMidiGet, doMidiSearch } from '../actions/midi'

import Heading from './heading'
import Loader from './loader'
import Midi from './midi'
import Page from './page'
import Pagination from './pagination'
import { MidiFeedTopAd, MidiFeedAd, PageLevelAd, MidiFeedSidebarAd } from './ads'

export default class RelatedPage extends Page {
  async load () {
    const { store, dispatch } = this.context
    const { midiSlug } = store.location.params
    const { page } = store.location.query

    const { result: midi } = await dispatch(doMidiGet({ slug: midiSlug }))

    await dispatch(doMidiSearch({ q: midi.name, page }))

    if (midiSlug.toLowerCase() !== midiSlug) {
      return dispatch('LOCATION_REPLACE', `${midi.url}/related`)
    }

    const meta = {
      title: [`MIDIs related to ${midi.name}`],
      description: [`List of MIDIs that are related to the ${midi.name}' MIDI file.`]
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
    const { midiSlug } = store.location.params
    const { page } = location.query

    if (!this.loaded) {
      return <Loader center label={`Loading MIDIs related to ${midiSlug}`} />
    }

    const midi = data.midis[midiSlug]

    const search = views.search[midi.name]
    const pageTotal = search && search.pageTotal
    const total = search && search.total
    const results = search && search[page]
      ? search[page].map(midiSlug => data.midis[midiSlug])
      : []

    return (
      <div>
        <Heading><span class='mid-gray'>MIDIs related to</span> {midi.name}</Heading>

        <MidiFeedSidebarAd />
        <div class='mv4'>
          {results.map((midi, i) =>
            <Fragment key={midi.slug}>
              <Midi midi={midi} showImage={false} showPlay={false} />
              {i === 4 && <MidiFeedTopAd class='center' />}
              {i > 0 && i % 9 === 0 && <MidiFeedAd class='center' />}
            </Fragment>
          )}
        </div>

        <Pagination page={page} pageTotal={pageTotal} total={total} />
        <PageLevelAd />
      </div>
    )
  }
}

import { h } from 'preact' /** @jsx h */

import { doMidiAll } from '../actions/midi'

import Heading from './heading'
import Loader from './loader'
import Midi from './midi'
import Page from './page'
import Pagination from './pagination'

export default class HomePage extends Page {
  async load () {
    const { store, dispatch } = this.context
    const { page } = store.location.query

    await dispatch(doMidiAll({ page }))

    const title = ['Popular MIDIs']
    if (page !== '0') title.unshift(`Page ${page}`)
    dispatch('APP_META', { title })
  }

  render (props) {
    if (!this.loaded) return <Loader center />

    const { store } = this.context
    const { data, views } = store
    const { page } = store.location.query

    const midiSlugs = views.all[page]
    const midis = midiSlugs
      ? midiSlugs.map(midiSlug => data.midis[midiSlug])
      : []

    const numFiles = views.all.total
      ? views.all.total.toLocaleString()
      : 'lots of'

    return (
      <div>
        { page === '0' && <HomePageHero numFiles={numFiles} /> }

        <Heading class='tc'>Popular MIDIs</Heading>
        { midis.map(midi => <Midi midi={midi} />) }

        <Pagination
          page={page}
          pageTotal={views.all.pageTotal}
          total={views.all.total}
        />
      </div>
    )
  }
}

const HomePageHero = ({ numFiles }) => {
  return (
    <div>
      <div
        class='cover bg-center absolute top-0 left-0 w-100'
        style={{
          backgroundImage: 'url("/img/hero.jpg")',
          zIndex: -1,
          height: 480
        }}
      />
      <div class='white pv5 ph3' style={{
        height: 450
      }}>
        <h1 class='f2 f1-l measure lh-title fw9'>
          Listen to your favorite MIDI files on BitMidi
        </h1>
        <h2 class='f4 fw6 lh-copy'>
          Serving {numFiles} MIDI files curated by volunteers around the world.
        </h2>
      </div>
    </div>
  )
}

import { h } from 'preact' /** @jsx h */

import { doMidiAll } from '../actions/midi'

import Heading from './heading'
import Image from './image'
import Loader from './loader'
import Midi from './midi'
import Page from './page'
import Pagination from './pagination'

export default class HomePage extends Page {
  async load () {
    const { store, dispatch } = this.context
    const { page } = store.location.query

    await dispatch(doMidiAll({ page }))

    const meta = {
      title: ['Popular MIDIs'],
      description: []
    }
    if (page !== '0') {
      const pageStr = `Page ${page}`
      meta.title.unshift(pageStr)
      meta.description.unshift(pageStr)
    }
    dispatch('APP_META', meta)
  }

  render (props) {
    if (!this.loaded) return <Loader center />

    const { store } = this.context
    const { data, views } = store
    const { page } = store.location.query

    const sortByPopularity = (midi1, midi2) => {
      if (midi1.plays < midi2.plays) {
        return 1;
      } else if (midi1.plays === midi2.plays) {
        return midi1.views === midi2.views ?
          0 : midi1.views < midi2.views ? 1 : -1
      } else {
        return -1;
      }
    }

    const midiSlugs = views.all[page]
    const midis = (midiSlugs
      ? midiSlugs.map(midiSlug => data.midis[midiSlug])
      : [])
        .sort(sortByPopularity);

    const numFiles = views.all.total
      ? views.all.total.toLocaleString()
      : 'lots of'

    return (
      <div>
        { page === '0' && <HomePageHero numFiles={numFiles} /> }

        <Heading class='tc'>Popular MIDIs</Heading>
        <div class='mv4'>
          { midis.map(midi => <Midi midi={midi} />) }
        </div>

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
      <Image
        src='/img/hero.jpg'
        alt='BitMidi hero image - MIDI vaporwave landscape'
        class='absolute top-0 left-0 w-100'
        style={{
          zIndex: -1,
          objectFit: 'cover',
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

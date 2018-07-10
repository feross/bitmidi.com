import { h } from 'preact' /** @jsx h */

import { doMidiAll } from '../actions/midi'

import Heading from './heading'
import Loader from './loader'
import Midi from './midi'
import PageComponent from './page-component'
import Pagination from './pagination'

export default class HomePage extends PageComponent {
  load () {
    const { store, dispatch } = this.context
    const { page } = store.location.query

    dispatch(doMidiAll({ page }))

    const title = ['Popular MIDIs']
    if (page !== '0') title.unshift(`Page ${page}`)

    dispatch('APP_META', { title, description: null })
  }

  render (props) {
    const { store } = this.context
    const { data, views } = store
    const { page } = store.location.query

    const midiSlugs = views.all[page]
    const midis = midiSlugs
      ? midiSlugs.map(midiSlug => data.midis[midiSlug])
      : []

    const showIntroText = page === '0'

    return (
      <div>
        { showIntroText &&
          <div
            class='cover bg-center absolute top-0 left-0 w-100'
            style={{
              backgroundImage: 'url(/img/hero.jpg)',
              zIndex: -1,
              height: 550
            }}
          />
        }
        { showIntroText &&
          <div class='white mv6 mh4 mb5' style={{ marginBottom: 200 }}>
            <h1 class='f2 f1-l measure lh-title fw9'>
              Listen to your favorite MIDI files on BitMidi
            </h1>
            { views.all.total &&
              <h2 class='f4 fw6 lh-copy'>
                Serving {views.all.total.toLocaleString()} MIDI files curated by volunteers around the world.
              </h2>
            }
          </div>
        }
        <Heading class='tc'>Popular MIDIs</Heading>
        <Loader show={!midiSlugs} center>
          {midis.map(midi => <Midi midi={midi} />)}
        </Loader>
        <Pagination
          page={page}
          pageTotal={views.all.pageTotal}
          total={views.all.total}
        />
      </div>
    )
  }
}

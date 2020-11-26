import { Component } from 'preact'
import oneLine from 'common-tags/lib/oneLine'

import { isBrowser, siteName, siteImage } from '../config'
import { doMidiGet } from '../actions/midi'

import Icon from './icon'
import Image from './image'
import Link from './link'
import Loader from './loader'
import Page from './page'

export default class EmbedPage extends Page {
  static showAppShell = false

  async load () {
    const { store, dispatch } = this.context
    const { midiSlug } = store.location.params

    const { result: midi } = await dispatch(doMidiGet({ slug: midiSlug }))

    if (midiSlug.toLowerCase() !== midiSlug) {
      return dispatch('LOCATION_REPLACE', midi.url)
    }

    dispatch('APP_META', {
      title: midi.name,
      description: oneLine`
        Listen to ${midi.name}, a free MIDI file on ${siteName}. Play, download, or share the MIDI song ${midi.name} from your web browser.
      `,
      image: midi.image,
      meta: {
        robots: 'noindex' // Prevent embed page from being indexed
      }
    })
  }

  componentDidMount () {
    super.componentDidMount()

    const { store, dispatch } = this.context
    const { autoplay = '0' } = store.location.query
    const { midiSlug } = store.location.params

    const midi = store.data.midis[midiSlug]

    // Try to autoplay when autoplay=1 param is present
    if (isBrowser && autoplay === '1') {
      // HACK: Autoplay seems to always work in Firefox
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      const userActivation = 'userActivation' in navigator &&
        navigator.userActivation.isActive

      if (isFirefox || userActivation) {
        dispatch('MIDI_PLAY_PAUSE', midi.slug)
      }
    }
  }

  render (props, _, { store }) {
    const { data } = store
    const { midiSlug } = store.location.params

    if (!this.loaded) {
      return <Loader center label={`Loading ${midiSlug}`} />
    }

    const midi = data.midis[midiSlug]

    return <EmbedMidi midi={midi} />
  }
}

class EmbedMidi extends Component {
  render (props, _, { theme, store }) {
    const { midi } = props
    const { mainColor } = theme
    const { player } = store

    const isPlaying = player.currentSlug === midi.slug

    const image = midi.image || siteImage

    return (
      <article class='absolute absolute--fill'>
        <Link
          color='white'
          title={`Play ${midi.name}`}
          onClick={this.handleClick}
        >
          <div class={`bg-${mainColor} pv2 ph3 flex`} style={{ height: 45 }}>
            <h2 class='flex-auto f4 mv0 lh-copy truncate underline-hover'>{midi.name}</h2>
            <div class='flex-none grow-large'>
              {isPlaying
                ? <Icon color='#fff' name='av/stop' />
                : <Icon color='#fff' name='av/play_arrow' />}
            </div>
          </div>
          <Image
            alt={midi.name}
            class='db midi-image w-100 bg-center'
            src={image}
            style={{
              objectFit: 'cover',
              height: 'calc(100% - 45px)'
            }}
          />
        </Link>
      </article>
    )
  }

  handleClick = () => {
    const { dispatch } = this.context
    const { midi } = this.props
    dispatch('MIDI_PLAY_PAUSE', midi.slug)
  }
}

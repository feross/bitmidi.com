import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'

import Icon from './icon'
import Image from './image'
import Link from './link'

export default class Midi extends Component {
  render (props, _, { theme, store }) {
    const {
      class: className,
      midi,
      showImage = true,
      showPlay = true
    } = props
    const { mainColor } = theme
    const { player } = store

    const isPlaying = player.currentSlug === midi.slug

    return (
      <article
        class={c('relative br2 mv3 mv3-m mv4-l shadow-6', className)}
      >
        <Link
          color='white'
          href={showPlay ? null : midi.url}
          title={showPlay ? `Play ${midi.name}` : midi.name}
          onClick={showPlay ? this.handleClick : null}
        >
          {midi.image && showImage &&
            <Image
              alt={midi.name}
              class='db midi-image w-100 br2 br--top h5 bg-center'
              src={midi.image}
              style={{
                objectFit: 'cover'
              }}
            />}
          <div
            class={c(`br2 bg-${mainColor} pv2 ph3 flex`, {
              'br--bottom': midi.image && showImage
            })}
          >
            <h2 class='flex-auto f4 mv0 lh-copy truncate underline-hover'>{midi.name}</h2>
            {showPlay &&
              <div class='flex-none grow-large'>
                {isPlaying
                  ? <Icon color='#fff' name='av/stop' />
                  : <Icon color='#fff' name='av/play_arrow' />}
              </div>}
          </div>
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

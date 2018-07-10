import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'

import Link from './link'

export default class Midi extends Component {
  render (props) {
    const { midi } = props
    const { mainColor } = this.context.theme

    return (
      <article
        class={c('relative br2 center hidden mv4 shadow-6', props.class)}
      >
        <div
          class={`cf br2 br--top white pv2 ph3 bg-${mainColor}`}
        >
          <Link
            color='white'
            class='dib fl f4 lh-copy w-100'
            title={midi.name}
            href={midi.url}
          >
            <h2 class='f4 mv0 w-100 truncate'>{midi.name}</h2>
          </Link>
        </div>
        <div class='overflow-hidden br2 br--bottom'>
          <div onClick={this.onClick}>MIDI</div>
        </div>
      </article>
    )
  }

  onClick = () => {
    const { dispatch } = this.context
    const { midi } = this.props
    dispatch('MIDI_PLAY', midi.slug)
  }
}

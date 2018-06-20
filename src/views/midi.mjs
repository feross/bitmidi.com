import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'

import { load, play } from '../browser/player'

import Link from './link'

export default class Midi extends Component {
  render (props) {
    const { midi } = props
    const { mainColor } = this.context.theme

    return (
      <article
        class={c('relative br3 center hidden mv4 shadow-6', props.class)}
      >
        <div
          class={`cf br3 br--top white pv2 ph3 bg-${mainColor}`}
        >
          <Link
            color='white'
            class='dib fl f4 lh-copy truncate'
            title={midi.name}
            href={midi.id}
          >
            <h2 class='f4 mv0'>{midi.name}</h2>
          </Link>
        </div>
        <div class='overflow-hidden br3 br--bottom'>
          <div onClick={this.onClick}>MIDI</div>
        </div>
      </article>
    )
  }

  onClick = () => {
    const { midi } = this.props
    load(midi.downloadUrl)
    play()
  }
}

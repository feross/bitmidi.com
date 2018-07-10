import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'

import Icon from './Icon'
import Link from './link'

export default class Midi extends Component {
  render (props) {
    const { midi } = props
    const { mainColor } = this.context.theme

    return (
      <article
        class={c(`cf white bg-${mainColor} br2 pv2 ph3 mv4 shadow-6`, props.class)}
      >
        <Link
          color='white'
          class='dib fl f4 lh-copy w-80'
          title={midi.name}
          href={midi.url}
        >
          <h2 class='f4 mv0 w-100 truncate'>{midi.name}</h2>
        </Link>
        <Link
          color='white'
          class='fr tr grow-large'
          onClick={this.onClick}
          title={`Play ${midi.name}`}
        >
          <Icon class='v-btm' size={30} name='play_arrow' />
        </Link>
      </article>
    )
  }

  onClick = () => {
    const { dispatch } = this.context
    const { midi } = this.props
    dispatch('MIDI_PLAY', midi.slug)
  }
}

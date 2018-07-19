import { h } from 'preact' /** @jsx h */

import { doGoMidiRandom } from '../actions/midi'

import Loader from './loader'
import PageComponent from './page-component'

export default class RandomPage extends PageComponent {
  load () {
    const { dispatch } = this.context
    dispatch('APP_META', {
      title: 'Random MIDI'
    })
    dispatch(doGoMidiRandom())
  }
  render (props) {
    return <Loader center show label='Finding random MIDI' />
  }
}

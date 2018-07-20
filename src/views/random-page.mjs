import { h } from 'preact' /** @jsx h */

import { doGoMidiRandom } from '../actions/midi'

import Loader from './loader'
import PageComponent from './page-component'

export default class RandomPage extends PageComponent {
  async load () {
    const { dispatch } = this.context
    dispatch('APP_META', {
      title: 'Random MIDI'
    })
    await dispatch(doGoMidiRandom())
  }
  render (props) {
    return <Loader center label='Finding random MIDI' />
  }
}

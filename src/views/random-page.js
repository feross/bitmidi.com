
import { doGoMidiRandom } from '../actions/midi'

import Loader from './loader'
import Page from './page'

export default class RandomPage extends Page {
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

import { h } from 'preact' /** @jsx h */

import config from '../../config'

import Heading from './heading'
import PageComponent from './page-component'

export default class AboutPage extends PageComponent {
  load () {
    const { dispatch } = this.context
    dispatch('APP_META', {
      title: `About ${config.title}`
    })
  }

  render (props) {
    return (
      <div>
        <Heading>About {config.title}, the free MIDI site</Heading>
        <p>Hi</p>
      </div>
    )
  }
}

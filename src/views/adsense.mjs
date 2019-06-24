import { Component, h } from 'preact' /** @jsx h */

import { isBrowser, tokens } from '../config'

export default class Adsense extends Component {
  componentDidMount () {
    if (isBrowser) {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  }

  render (props) {
    return (
      <div {...props}>
        <ins
          class='adsbygoogle'
          style={{ display: 'block' }}
          data-ad-client={tokens.adsense}
          data-ad-slot='2581488270'
          data-ad-format='auto'
          data-full-width-responsive='true'
        />
      </div>
    )
  }
}

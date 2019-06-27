import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'

import { isBrowser, isProd, tokens } from '../config'

export default class Adsense extends Component {
  componentDidMount () {
    if (isBrowser && isProd) {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    }
  }

  shouldComponentUpdate () {
    return false
  }

  render (props) {
    const {
      'data-ad-format': adFormat,
      'data-ad-slot': adSlot,
      class: className,
      ...rest
    } = props

    if (!isProd) {
      return (
        <div class={c('bg-washed-red h5', className)} {...rest} />
      )
    }

    if (typeof adFormat !== 'string' || adFormat.length === 0) {
      throw new Error('Prop `adFormat` must be a string of non-zero length')
    }

    if (typeof adSlot !== 'string' || adSlot.length === 0) {
      throw new Error('Prop `adSlot` must be a string of non-zero length')
    }

    return (
      <div>
        <ins
          key={Math.random()}
          class={c('adsbygoogle', className)}
          style={{ display: 'block' }}
          data-ad-client={tokens.adsense}
          data-ad-format={adFormat}
          data-ad-slot={adSlot}
          {...rest}
        />
      </div>
    )
  }
}

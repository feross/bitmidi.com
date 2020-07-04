import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'

import { isBrowser, isProd, tokens } from '../config'

export default class Adsense extends Component {
  componentDidMount () {
    if (!isBrowser || !isProd) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {}
  }

  shouldComponentUpdate () {
    return false
  }

  render (props) {
    const {
      'data-ad-format': adFormat,
      'data-ad-slot': adSlot,
      'data-ad-client': adClient,
      class: className,
      ...rest
    } = props

    if (typeof adFormat !== 'string' || adFormat.length === 0) {
      throw new Error('Prop `data-ad-format` must be a string of non-zero length')
    }

    if (typeof adSlot !== 'string' || adSlot.length === 0) {
      throw new Error('Prop `data-ad-slot` must be a string of non-zero length')
    }

    if (adClient != null) {
      throw new Error('Prop `data-ad-client` must not be present')
    }

    if (!isProd) {
      return (
        <div class={c('bg-washed-red h5', className)} {...rest}>
          Adsense
        </div>
      )
    }

    return (
      <div>
        <ins
          key={Math.random()}
          class={c('adsbygoogle', className)}
          data-ad-client={tokens.adsense}
          data-ad-format={adFormat}
          data-ad-slot={adSlot}
          style={{ display: 'block' }}
          {...rest}
        />
      </div>
    )
  }
}

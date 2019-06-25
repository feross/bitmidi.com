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
      'data-ad-slot': adSlot,
      'data-ad-format': adFormat,
      class: className,
      ...rest
    } = props

    if (!isProd) {
      return (
        <div class={c('bg-washed-red h5', className)} {...rest} />
      )
    }

    if (typeof adSlot !== 'string' || adSlot.length === 0) {
      throw new Error('Prop `adSlot` must be a string of non-zero length')
    }

    if (typeof adFormat !== 'string' || adFormat.length === 0) {
      throw new Error('Prop `adFormat` must be a string of non-zero length')
    }

    return (
      <div>
        <ins
          key={Math.random()}
          class={c('adsbygoogle', className)}
          style={{ display: 'block' }}
          data-ad-client={tokens.adsense}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          {...props}
        />
      </div>
    )
  }

  // componentDidMount () {
  //   const { store } = this.context
  //   if (store.app.isServerRendered) return
  //   if (isBrowser) {
  //     console.log('ad push')
  //     ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  //   }
  // }

  // shouldComponentUpdate () {
  //   console.log('Adsense shouldComponentUpdate')
  //   const { store } = this.context
  //   if (store.app.isServerRendered) return false
  //   return true
  // }

  // shouldComponentUpdate () {
  //   console.log(`Adsense shouldComponentUpdate, isBrowser: ${isBrowser}`)
  //   return false
  // }

  // render (props, _, { store }) {
  //   console.log(`Adsense render, isBrowser: ${isBrowser}`)

  //   if (isBrowser) {
  //     return <div dangerouslySetInnerHTML={{ __html: '' }} />
  //   }

  //   return (
  //     <div {...props}>
  //       <ins
  //         class='adsbygoogle'
  //         style={{ display: 'block' }}
  //         data-ad-client={tokens.adsense}
  //         data-ad-slot='2581488270'
  //         data-ad-format='auto'
  //         data-full-width-responsive='true'
  //       />
  //       <script
  //         dangerouslySetInnerHTML={{
  //           __html: 'console.log("ad push"); (adsbygoogle = window.adsbygoogle || []).push({})'
  //         }}
  //       />
  //     </div>
  //   )
  // }
}

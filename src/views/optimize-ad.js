import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'
import loadScript from 'load-script2'

import { isBrowser, isProd } from '../config'

export default class OptimizeAd extends Component {
  componentDidMount () {
    if (!isBrowser || !isProd) return
    loadScript('https://cdn-s2s.buysellads.net/pub/bitmidi.js')
  }

  shouldComponentUpdate () {
    return false
  }

  render (props) {
    const { class: className, ...rest } = props

    if (!isProd) {
      return (
        <div
          class={c('bg-washed-red h4', className)}
          {...rest}
        >
          Optimize
        </div>
      )
    }

    return (
      <div {...props} />
    )
  }
}

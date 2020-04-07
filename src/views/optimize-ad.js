import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'

import { isProd } from '../config'

export default class OptimizeAd extends Component {
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

import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'

import { isProd } from '../config'

export default class NeworAd extends Component {
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
          Newor
        </div>
      )
    }

    return (
      <div {...props} />
    )
  }
}

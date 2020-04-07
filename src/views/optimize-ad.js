import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'

import { isBrowser, isProd } from '../config'

export default class OptimizeAd extends Component {
  componentDidMount () {
    if (!isBrowser || !isProd) return
    const { id } = this.props
    window.optimize = window.optimize || { queue: [] }
    window.optimize.queue.push(() => {
      window.optimize.push(id)
    })
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

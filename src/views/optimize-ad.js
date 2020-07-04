import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'

import { isBrowser, isProd } from '../config'

export default class OptimizeAd extends Component {
  componentDidMount () {
    const { store } = this.context
    if (!isBrowser || !isProd || store.app.isServerRendered) return

    const { id } = this.props
    window.optimize = window.optimize || { queue: [] }
    try {
      window.optimize.queue.push(() => {
        window.optimize.push(id)
      })
    } catch (err) {}
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

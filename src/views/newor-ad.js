import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'

import { isBrowser, isProd } from '../config'

export default class NeworAd extends Component {
  shouldComponentUpdate () {
    return false
  }

  ref = elem => {
    const { store } = this.context
    const { id } = this.props
    if (!isBrowser || !isProd || store.app.isServerRendered) return

    if (elem && !elem.getAttribute('data-processed')) {
      console.log('WALDO REFRESH TAG')
      window.waldo.refreshTag(id)
    }
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
      <div ref={this.ref} {...props} />
    )
  }
}

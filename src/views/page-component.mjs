import { Component } from 'preact'

import { isBrowser, loadInterval } from '../../config'

export default class PageComponent extends Component {
  constructor () {
    super()
    this._interval = null
  }

  componentDidMount () {
    this.load()
    if (isBrowser) {
      this._interval = setInterval(() => this.load(), loadInterval)
    }
  }

  componentWillReceiveProps (nextProps) {
    // If the user navigates, then the location prop of <Page location={location} />
    // will change. Call load() since new data may need to be fetched.
    if (this.props.url !== nextProps.url) this.load()
  }

  componentWillUnmount () {
    if (isBrowser) {
      clearTimeout(this._interval)
      this._interval = null
    }
  }
}

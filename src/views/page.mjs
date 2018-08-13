import { Component } from 'preact'

import { isBrowser, loadInterval } from '../config'

export default class Page extends Component {
  constructor () {
    super()
    this._interval = null
    this.state = {
      loaded: false
    }
  }

  componentDidMount () {
    this._load()
    if (isBrowser) {
      this._interval = setInterval(() => this._load(), loadInterval)
    }
  }

  componentWillReceiveProps (nextProps) {
    // If the user navigates, then the url prop of <Page /> will change.
    // Call load() since new data may need to be fetched.
    if (this.props.url !== nextProps.url) {
      this.setState({ loaded: false }, () => this._load())
    }
  }

  componentWillUnmount () {
    if (isBrowser) {
      clearTimeout(this._interval)
      this._interval = null
    }
  }

  // Optionally overwritten in subclass
  async load () {}

  async _load () {
    try {
      await this.load()
      this.setState({ loaded: true })
    } catch {}
  }

  get loaded () {
    return this.state.loaded
  }
}

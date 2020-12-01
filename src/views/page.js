import { Component } from 'preact'

export default class Page extends Component {
  static showAppShell = true

  constructor () {
    super()
    this.state = {
      loaded: false
    }
  }

  componentDidMount () {
    const { isServerRendered } = this.props
    if (!isServerRendered) this._load()
  }

  componentWillReceiveProps (nextProps) { // eslint-disable-line react/no-deprecated
    // If the user navigates, then the url prop of <Page /> will change.
    // Call _load() since new data may need to be fetched.
    if (this.props.url !== nextProps.url ||
        this.props.isServerRendered !== nextProps.isServerRendered) {
      this.setState({ loaded: false }, () => this._load())
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
    const { isServerRendered } = this.props
    return this.state.loaded || isServerRendered
  }
}

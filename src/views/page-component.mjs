import { Component } from 'preact'

export default class PageComponent extends Component {
  componentDidMount () {
    this.load()
  }

  componentWillReceiveProps (nextProps) {
    // If the user navigates, then the location prop of <Page location={location} />
    // will change. Call load() since new data may need to be fetched.
    if (this.props.url !== nextProps.url) this.load()
  }
}

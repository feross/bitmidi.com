const { Component } = require('preact')

class PageComponent extends Component {
  componentDidMount () {
    this.load()
  }

  componentWillReceiveProps (nextProps) {
    // If the user navigates, then the location prop of <Page location={location} />
    // will change. Call load() since new data may need to be fetched.
    if (this.props.location !== nextProps.location) this.load()
  }

  load () {
    throw new Error('PageComponent instance is missing required load() method')
  }
}

module.exports = PageComponent

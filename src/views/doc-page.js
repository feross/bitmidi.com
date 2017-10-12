const { Component, h } = require('preact') /** @jsx h */

const Heading = require('./heading')
const Loader = require('./loader')

class DocPage extends Component {
  componentDidMount () {
    this.load()
  }

  load () {
    const { dispatch } = this.context
    const { location } = this.context.store

    dispatch('APP_TITLE', this.getTitle())
    dispatch('API_DOC', location.params)
  }

  render (props) {
    const { doc } = this.context.store

    const title = this.getTitle()

    return (
      <Loader show={doc == null} center>
        <Heading>{title}</Heading>
        <p dangerouslySetInnerHTML={{__html: doc}} />
      </Loader>
    )
  }

  getTitle () {
    const { location } = this.context.store

    return location.params.url
  }
}

module.exports = DocPage

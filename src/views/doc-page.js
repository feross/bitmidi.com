const { Component, h } = require('preact') /** @jsx h */

const Heading = require('./heading')
const Loader = require('./loader')

class DocPage extends Component {
  componentDidMount () {
    this.load()
  }

  load () {
    const { store, dispatch } = this.context
    const { doc, location } = store

    dispatch('APP_TITLE', this.getTitle())
    if (doc == null) dispatch('FETCH_DOC', location.params)
  }

  render (props) {
    const { store } = this.context
    const { doc } = store

    if (doc == null) {
      return <Loader center />
    }

    const title = this.getTitle()
    return (
      <div>
        <Heading>{title}</Heading>
        <p dangerouslySetInnerHTML={{__html: doc}} />
      </div>
    )
  }

  getTitle () {
    const { store } = this.context
    const { location } = store

    return location.params.url
  }
}

module.exports = DocPage

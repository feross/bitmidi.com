const { Component, h } = require('preact') /** @jsx h */

const Heading = require('./heading')

class DocPage extends Component {
  componentDidMount () {
    this.load()
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch } = this.context
    dispatch('APP_TITLE', this.getTitle())
  }

  load () {
    const { store, dispatch } = this.context
    const { doc, location } = store

    dispatch('APP_TITLE', this.getTitle())
    if (doc == null) dispatch('FETCH_DOC', location.params)
  }

  getTitle () {
    const { store } = this.context
    const { location } = store
    return location.params.url
  }

  render (props, state, context) {
    const { store } = context
    const { doc } = store
    return (
      <div>
        <Heading>Doc Page</Heading>
        <p dangerouslySetInnerHTML={{__html: doc}} />
      </div>
    )
  }
}

module.exports = DocPage

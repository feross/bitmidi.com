const { Component, h } = require('preact') /** @jsx h */

const Heading = require('./heading')

class DocPage extends Component {
  componentDidMount () {
    this.load()
  }

  load () {
    const { store, dispatch } = this.context
    const { location } = store

    dispatch('APP_TITLE', 'Doc Page')
    dispatch('FETCH_DOC', location.params)
  }

  render (props, state, context) {
    const { store } = context
    const { doc } = store
    return (
      <div>
        <Heading>Doc Page</Heading>
        <p>{doc}</p>
      </div>
    )
  }
}

module.exports = DocPage

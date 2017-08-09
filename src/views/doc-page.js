const { Component, h } = require('preact') /** @jsx h */

class DocPage extends Component {
  componentDidMount () {
    this.load()
  }

  load () {
    const { store } = this.context
    const { location } = store

    store.dispatch('APP_TITLE', 'Doc Page')
    store.dispatch('FETCH_DOC', location.params)
  }

  render (props, state, context) {
    const { store } = context
    const { doc } = store
    return (
      <div>
        <h1>Doc Page</h1>
        <p>{doc}</p>
      </div>
    )
  }
}

module.exports = DocPage

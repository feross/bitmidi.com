const { Component, h } = require('preact') /** @jsx h */

const store = require('../store')

class DocPage extends Component {
  componentDidMount () {
    this._load()
  }

  _load () {
    store.dispatch('APP_TITLE', 'Doc Page')
  }

  render (props) {
    return (
      <h1>Doc Page</h1>
    )
  }
}

module.exports = DocPage

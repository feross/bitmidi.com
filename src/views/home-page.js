const { Component, h } = require('preact') /** @jsx h */

const store = require('../store')

class HomePage extends Component {
  componentDidMount () {
    this._load()
  }

  _load () {
    store.dispatch('APP_TITLE', null)
  }

  render (props) {
    return (
      <h1>Home Page</h1>
    )
  }
}

module.exports = HomePage

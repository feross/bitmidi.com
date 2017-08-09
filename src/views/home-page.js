const { Component, h } = require('preact') /** @jsx h */

class HomePage extends Component {
  componentDidMount () {
    this.load()
  }

  load () {
    const { store } = this.context
    store.dispatch('APP_TITLE', null)
  }

  render (props) {
    return (
      <h1>Home Page</h1>
    )
  }
}

module.exports = HomePage

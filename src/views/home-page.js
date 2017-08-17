const { Component, h } = require('preact') /** @jsx h */

const Heading = require('./heading')

class HomePage extends Component {
  componentDidMount () {
    this.load()
  }

  load () {
    const { dispatch } = this.context
    dispatch('APP_TITLE', null)
  }

  render (props) {
    return (
      <Heading>Home Page</Heading>
    )
  }
}

module.exports = HomePage

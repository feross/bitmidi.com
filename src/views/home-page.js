const { Component, h } = require('preact') /** @jsx h */

const Heading = require('./heading')
const Snippet = require('./snippet')

class HomePage extends Component {
  componentDidMount () {
    this.load()
  }

  load () {
    const { dispatch } = this.context
    dispatch('APP_TITLE', null)
  }

  render (props) {
    const { store } = this.context
    const { snippets } = store
    return (
      <div>
        <Heading class='tc'>Top code snippets</Heading>
        {snippets.map(snippet => <Snippet snippet={snippet} />)}
      </div>
    )
  }
}

module.exports = HomePage

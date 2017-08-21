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
    dispatch('FETCH_SNIPPET_ALL')
  }

  render (props) {
    const { store } = this.context
    const { topSnippetIds, snippets } = store

    const topSnippets = topSnippetIds.map(snippetId => snippets[snippetId])

    return (
      <div>
        <Heading class='tc'>Top code snippets</Heading>
        {topSnippets.map(snippet => <Snippet snippet={snippet} />)}
      </div>
    )
  }
}

module.exports = HomePage

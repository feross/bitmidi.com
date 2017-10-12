const { Component, h } = require('preact') /** @jsx h */

const Heading = require('./heading')
const Loader = require('./loader')
const Snippet = require('./snippet')

class HomePage extends Component {
  componentDidMount () {
    this.load()
  }

  load () {
    const { dispatch } = this.context
    dispatch('APP_TITLE', null)
    dispatch('API_SNIPPET_ALL')
  }

  render (props) {
    const { topSnippetIds, snippets } = this.context.store

    const topSnippets = topSnippetIds &&
      topSnippetIds.map(snippetId => snippets[snippetId])

    return (
      <Loader show={topSnippetIds == null} center>
        <Heading class='tc'>Most copied code snippets</Heading>
        {topSnippets && topSnippets.map(snippet => <Snippet snippet={snippet} />)}
      </Loader>
    )
  }
}

module.exports = HomePage

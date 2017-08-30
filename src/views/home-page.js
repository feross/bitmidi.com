const { Component, h } = require('preact') /** @jsx h */

const Heading = require('./heading')
const Loader = require('./loader')
const Snippet = require('./snippet')

class HomePage extends Component {
  componentDidMount () {
    this.load()
  }

  load () {
    const { store, dispatch } = this.context
    const { topSnippetIds } = store
    dispatch('APP_TITLE', null)
    if (topSnippetIds == null) dispatch('FETCH_SNIPPET_ALL')
  }

  render (props) {
    const { store } = this.context
    const { topSnippetIds, snippets } = store

    if (topSnippetIds == null) {
      return <Loader center />
    }

    const topSnippets = topSnippetIds.map(snippetId => snippets[snippetId])

    return (
      <div>
        <Heading class='tc mv4'>Most loved code snippets</Heading>
        {topSnippets.map(snippet => <Snippet snippet={snippet} />)}
      </div>
    )
  }
}

module.exports = HomePage

const { h } = require('preact') /** @jsx h */

const Heading = require('./heading')
const Loader = require('./loader')
const Snippet = require('./snippet')
const PageComponent = require('./page-component')

class SnippetPage extends PageComponent {
  load () {
    const { dispatch } = this.context
    const { location } = this.context.store
    const { snippetId } = location.params

    dispatch('API_SNIPPET_GET', { id: snippetId })
    dispatch('APP_TITLE', 'Snippet Page')
  }

  render (props) {
    const { store } = this.context
    const { location } = store
    const { snippetId } = location.params

    const snippet = store.snippets[snippetId]

    return (
      <Loader show={snippet == null} center>
        <Heading>SnippetPage</Heading>
        <Snippet snippet={snippet} />
      </Loader>
    )
  }
}

module.exports = SnippetPage

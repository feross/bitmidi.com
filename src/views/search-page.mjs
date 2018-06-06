import { h } from 'preact' /** @jsx h */

import Heading from './heading'
import Loader from './loader'
import PageComponent from './page-component'
import Snippet from './snippet'

export default class SearchPage extends PageComponent {
  load () {
    const { dispatch } = this.context
    const { location } = this.context.store
    const q = location.query.q

    dispatch('APP_META', {
      title: `Snippets containing '${q}'`,
      description: `Search results page for code snippets that contain '${q}'`
    })
    dispatch('API_SNIPPET_SEARCH', { q })
  }

  render (props) {
    const { location, searches } = this.context.store
    const q = location.query.q

    const search = searches[q]
    const snippets = search && search.snippets

    return (
      <Loader show={search == null} center>
        <Heading><span class='light-silver'>Search for</span> '{q}'</Heading>
        {snippets && snippets.map(snippet => <Snippet snippet={snippet} />)}
        { snippets && snippets.length === 0 && <div class='mt4'>No results.</div> }
      </Loader>
    )
  }
}

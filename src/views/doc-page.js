const { h } = require('preact') /** @jsx h */

const Heading = require('./heading')
const Loader = require('./loader')
const PageComponent = require('./page-component')

class DocPage extends PageComponent {
  load () {
    const { dispatch } = this.context
    const { location } = this.context.store

    dispatch('APP_META', { title: this.getTitle() })
    dispatch('API_DOC', location.params)
  }

  render (props) {
    const { doc } = this.context.store

    const title = this.getTitle()

    return (
      <Loader show={doc == null} center>
        <Heading>{title}</Heading>
        <p dangerouslySetInnerHTML={{__html: doc}} />
      </Loader>
    )
  }

  getTitle () {
    const { location } = this.context.store

    return location.params.url
  }
}

module.exports = DocPage

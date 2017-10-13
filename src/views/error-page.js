const { h } = require('preact') /** @jsx h */

const Heading = require('./heading')
const PageComponent = require('./page-component')

class ErrorPage extends PageComponent {
  load () {
    const { dispatch } = this.context
    const firstError = this.getError()
    dispatch('APP_TITLE', firstError.message)
  }

  render (props) {
    const firstError = this.getError()

    return (
      <Heading>Error – {firstError.message}</Heading>
    )
  }

  getError = () => {
    const { store } = this.context
    const { fatalError, errors } = store
    return fatalError || errors[0] || { message: 'Page Not Found' }
  }
}

module.exports = ErrorPage

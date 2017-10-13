const { h } = require('preact') /** @jsx h */

const Heading = require('./heading')
const PageComponent = require('./page-component')

class ErrorPage extends PageComponent {
  load () {
    const { dispatch } = this.context
    const firstError = this.getFirstError()
    dispatch('APP_TITLE', firstError.message)
  }

  render (props) {
    const firstError = this.getFirstError()

    return (
      <Heading>Error – {firstError.message}</Heading>
    )
  }

  getFirstError = () => {
    const { store } = this.context
    const { errors } = store
    return errors[0] || { message: 'Page Not Found' }
  }
}

module.exports = ErrorPage

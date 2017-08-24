const { h, Component } = require('preact') /** @jsx h */

const Heading = require('./heading')

class ErrorPage extends Component {
  componentDidMount () {
    this.load()
  }

  load () {
    const { dispatch } = this.context
    const firstError = this.getFirstError()
    dispatch('APP_TITLE', firstError)
  }

  render (props) {
    const firstError = this.getFirstError()

    return (
      <Heading>Error – {firstError}</Heading>
    )
  }

  getFirstError = () => {
    const { store } = this.context
    const { errors } = store
    return errors[0] || 'Page Not Found'
  }
}

module.exports = ErrorPage

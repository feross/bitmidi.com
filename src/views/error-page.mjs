import { h } from 'preact' /** @jsx h */

import Heading from './heading'
import Page from './page'

export default class ErrorPage extends Page {
  load () {
    const { dispatch } = this.context
    const err = this.getError()
    dispatch('APP_META', { title: err.message })
  }

  render (props) {
    const err = this.getError()

    return (
      <Heading>Error – {err.message}</Heading>
    )
  }

  getError = () => {
    const { errors } = this.context.store
    return errors[errors.length - 1] || { message: 'Not Found' }
  }
}

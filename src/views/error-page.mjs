import { h } from 'preact' /** @jsx h */

import Heading from './heading'
import Page from './page'

export default class ErrorPage extends Page {
  load () {
    const { dispatch } = this.context
    const firstError = this.getError()
    dispatch('APP_META', { title: firstError.message })
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

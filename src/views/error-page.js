
import Heading from './heading'
import Random from './random'
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
      <div class='tc'>
        <Random>
          <div>
            <Heading>Well, this is embarrassing…</Heading>
            <ErrorEmoji>😅</ErrorEmoji>
          </div>
          <div>
            <Heading>You just blew our server's mind</Heading>
            <ErrorEmoji>😳💥😵</ErrorEmoji>
          </div>
          <div>
            <Heading>We're sorry.</Heading>
            <ErrorEmoji>😢 💐💐</ErrorEmoji>
          </div>
          <div>
            <Heading>What does the fox say?</Heading>
            <ErrorEmoji>❓ 🦊💬</ErrorEmoji>
          </div>
          <div>
            <Heading>Holy crap!</Heading>
            <ErrorEmoji>🙏 💩</ErrorEmoji>
          </div>
          <div>
            <Heading>Oh snap!</Heading>
            <ErrorEmoji>😲💥</ErrorEmoji>
          </div>
        </Random>
        <Heading>Error – {err.message}</Heading>
      </div>
    )
  }

  getError = () => {
    const { errors } = this.context.store
    return errors[errors.length - 1] || { message: 'Not Found' }
  }
}

const ErrorEmoji = ({ children }) => {
  return <div class='f-headline mv4'>{children}</div>
}

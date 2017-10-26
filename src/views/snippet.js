const { Component, h } = require('preact') /** @jsx h */
const c = require('classnames')

const Link = require('./link')
const Icon = require('./icon')
const Image = require('./image')

class Snippet extends Component {
  render (props) {
    const { snippet } = props
    const { mainColor } = this.context.theme

    return (
      <article
        class={c('relative br3 center hidden mv4 shadow-6', props.class)}
      >
        <div
          class='absolute top-0'
          style={{
            left: '-5rem',
            width: 62,
            height: 62
          }}
        >
          <Link
            class='pointer db ba b--moon-gray br-100 pa3 grow'
            title='Copy to clipboard'
            style={{
              userSelect: 'none',
              width: 62,
              height: 62,
              lineHeight: 1.15
            }}
            onClick={this.onUpvote}
          >
            <Icon name='content-copy' alt='Copy to clipboard' />
          </Link>
          <div
            class='f5 gray mt1 tc'
            title={
              `${snippet.votes} copy-and-paste${snippet.votes !== 1 ? 's' : ''}`
            }
          >
            {snippet.votes}
          </div>
        </div>
        <div
          class={`cf br3 br--top white pv2 ph3 bg-${mainColor}`}
        >
          <Link
            color='white'
            class='dib fl f4 lh-copy truncate'
            title={snippet.name}
            href={`/${snippet.id}`}
            style={{
              width: 'calc(100% - 45px)'
            }}
          >
            <h2 class='f4 mv0'>{snippet.name}</h2>
          </Link>
          <Link
            href={snippet.author_url}
            class='fr white grow'
            style={{ lineHeight: 0 }}
            title={`Snippet submitted by @${snippet.author}`}
            external
            newtab
          >
            <Image
              src={snippet.author_image}
              alt={`@${snippet.author}`}
              class='br-100 shadow-6'
              style={{ height: 30, width: 30 }}
            />
          </Link>
        </div>
        <div class='overflow-hidden br3 br--bottom'>
          <div dangerouslySetInnerHTML={{__html: snippet.html}} />
        </div>
      </article>
    )
  }

  onUpvote = () => {
    const { snippet } = this.props
    const { dispatch } = this.context
    dispatch('API_SNIPPET_VOTE', { id: snippet.id })
    dispatch('CLIPBOARD_COPY', snippet.code)
  }
}

module.exports = Snippet

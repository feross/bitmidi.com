const { Component, h } = require('preact') /** @jsx h */
const c = require('classnames')

const Link = require('./link')
const IconContentCopy = require('./icon-content-copy')
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
          <a
            class='pointer db ba b--moon-gray br-100 pa3 o-80 glow grow'
            title='Copy to clipboard'
            style={{
              userSelect: 'none',
              width: 62,
              height: 62,
              lineHeight: 1.15
            }}
            onClick={this.onUpvote}
          >
            <IconContentCopy fill='#555' size={29} />
          </a>
          <div
            class='f5 gray mt1 tc'
            title={`${snippet.votes} copies`}
          >
            {snippet.votes}
          </div>
        </div>
        <div
          class={`cf br3 br--top white pv2 ph3 bg-${mainColor}`}
        >
          <h1
            class='dib fl f4 lh-copy mv0 truncate'
            title={snippet.name}
            style={{
              width: 'calc(100% - 45px)'
            }}
          >
            {snippet.name}
          </h1>
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

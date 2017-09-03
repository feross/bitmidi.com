const { Component, h } = require('preact') /** @jsx h */
const c = require('classnames')

const Link = require('./link')

class Snippet extends Component {
  render (props) {
    const { snippet } = props
    const { mainColor } = this.context.theme

    return (
      <article
        class={c('relative br3 center hidden mv4 shadow-6', props.class)}
      >
        <a
          class='upvote pointer ba b--black-20 br-100 pa3 absolute top-0 o-80 glow grow'
          style={{
            userSelect: 'none',
            fontSize: '1.8rem',
            left: '-5rem',
            width: 62,
            height: 62,
            lineHeight: 1.15
          }}
          onClick={this.onUpvote}
        >
          👏 {snippet.votes}
        </a>
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
            title={`@${snippet.author}`}
            external
            newtab
          >
            <img
              src={snippet.author_image}
              class='br-100 shadow-6'
              style={{ height: 30, width: 30 }}
            />
          </Link>
        </div>
        <div class='overflow-hidden br3 br--bottom'>
          <div dangerouslySetInnerHTML={{__html: snippet.code_html}} />
        </div>
      </article>
    )
  }

  onUpvote = () => {
    const { snippet } = this.props
    const { dispatch } = this.context
    dispatch('FETCH_SNIPPET_VOTE', { id: snippet.id })
  }
}

module.exports = Snippet

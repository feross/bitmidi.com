const { Component, h } = require('preact') /** @jsx h */
const c = require('classnames')

const Link = require('./link')

class Snippet extends Component {
  render (props) {
    const { snippet } = props

    return (
      <article
        class={c('relative br3 center hidden mv4', props.class)}
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
        >
          👏
        </a>
        <div
          class='br3 br--top white pv2 ph3 bg-light-red'
        >
          <h1
            class='dib f4 lh-copy w-80 mv0 truncate'
            title={snippet.name}
          >
            {snippet.name}
          </h1>
          <Link href={snippet.author_url} class='dib white fr tr w-20' external newtab>
            <span class='v-mid'>@{snippet.author}</span>
            <img src={snippet.author_image} class='dib br-100 shadow3' style={{ height: 32 }} />
          </Link>
        </div>
        <div class='overflow-hidden br3 br--bottom'>
          <div dangerouslySetInnerHTML={{__html: snippet.code_html}} />
        </div>
      </article>
    )
  }
}

module.exports = Snippet

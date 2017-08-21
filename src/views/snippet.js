const { Component, h } = require('preact') /** @jsx h */
const c = require('classnames')

const SALMON_COLOR = '#FF5F4F'

class Snippet extends Component {
  render (props) {
    const { snippet } = props

    return (
      <article
        class={c('relative br3 center mw7 hidden mv4', props.class)}
      >
        <a
          class='pointer ba b--black-40 br-100 grow pa3 absolute top-0 f2'
          style={{
            userSelect: 'none',
            left: '-6rem',
            width: 72,
            height: 72,
            lineHeight: 1.15
          }}
        >
          👏
        </a>
        <h1
          class='f4 br3 br--top white mv0 pv2 ph3'
          style={{
            backgroundColor: SALMON_COLOR
          }}
        >
          {snippet.name}
        </h1>
        <div class='overflow-hidden br3 br--bottom'>
          <div dangerouslySetInnerHTML={{__html: snippet.code_html}} />
        </div>
      </article>
    )
  }
}

module.exports = Snippet

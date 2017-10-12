const { h } = require('preact') /** @jsx h */
const c = require('classnames')

const IconLoader = require('./icon-loader')

const Loader = (props) => {
  let { center, style } = props

  if (center) {
    style = Object.assign({
      marginTop: 'calc(50vh - 120px)'
    }, style)
  }

  return (
    <div
      class={c('tc animate-fade-in animate--delay animate--fast', props.class)}
      style={style}
    >
      <IconLoader size={120} fill='#ff41b4' />
    </div>
  )
}

module.exports = Loader

const { h } = require('preact') /** @jsx h */
const c = require('classnames')

const Loader = (props) => {
  let { center, style } = props

  if (center) {
    style = Object.assign({
      marginTop: 'calc(50vh - 105px)'
    }, style)
  }

  return (
    <div
      class={c('tc mt3', props.class)}
      style={style}
    >
      <img
        src='/img/triangle.svg'
        class='rotate-180 animate-fade-in animate--delay animate--fast'
        alt='Loading...'
      />
    </div>
  )
}

module.exports = Loader

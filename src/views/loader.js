const { h } = require('preact') /** @jsx h */
const c = require('classnames')

const IconLoader = require('./icon-loader')

const Loader = (props) => {
  let {
    center,
    children,
    class: className,
    show = false,
    style,
    ...rest
  } = props

  // Show loader
  if (show) {
    if (center) {
      style = Object.assign({
        marginTop: 'calc(50vh - 120px)'
      }, style)
    }

    return (
      <div
        class={c('tc animate-fade-in animate--delay animate--fast', className)}
        style={style}
        {...rest}
      >
        <IconLoader size={120} fill='#ff41b4' />
      </div>
    )
  }

  // Show content
  return (
    <div
      class={className}
      style={style}
      {...rest}
    >
      {children}
    </div>
  )
}

module.exports = Loader

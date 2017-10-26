const { h } = require('preact') /** @jsx h */
const c = require('classnames')

const Icon = require('./icon')

const Loader = (props) => {
  let {
    center,
    children,
    class: className,
    show = false,
    style = {},
    ...rest
  } = props

  // Show loader
  if (show) {
    if (center) style.marginTop = 'calc(50vh - 120px)'

    return (
      <div
        class={c('tc animate-fade-in animate--delay animate--fast', className)}
        style={style}
        {...rest}
      >
        <Icon name='loader' alt='Loading...' />
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

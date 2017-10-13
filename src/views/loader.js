const { h } = require('preact') /** @jsx h */
const c = require('classnames')

const IconLoader = require('./icon-loader')

const Loader = (props) => {
  const {
    center,
    children,
    class: className,
    show,
    style = {},
    ...rest
  } = props

  if (!show) {
    return (
      <main
        class={c('animate-fade-in animate--fast', className)}
        style={style}
        {...rest}
      >
        {children}
      </main>
    )
  }

  if (center && !style.marginTop) {
    style.marginTop = 'calc(50vh - 120px)'
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

module.exports = Loader

import { h } from 'preact' /** @jsx h */
import c from 'classnames'

import Icon from './icon'

const Loader = props => {
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
    if (center) {
      style.marginTop = 'calc(40vh - 80px)'
      style.marginBottom = 'calc(40vh - 80px)'
    }

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

export default Loader

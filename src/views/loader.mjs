import { h } from 'preact' /** @jsx h */
import c from 'classnames'

import Heading from './heading'
import Image from './image'

const Loader = props => {
  let {
    center,
    children,
    class: className,
    show = false,
    label,
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
        { label &&
          <Heading
            class='animate-pulse animate--normal animate--infinite'
          >
            {label}…
          </Heading>
        }
        <Image src='/img/icon-loader.svg' alt='Loading…' />
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

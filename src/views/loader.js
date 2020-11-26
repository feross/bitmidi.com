import c from 'classnames'

import Heading from './heading'
import Image from './image'

const Loader = props => {
  let {
    center,
    class: className,
    label = 'Loading',
    style,
    ...rest
  } = props

  if (center) {
    style = {
      marginTop: 'calc(40vh - 80px)',
      marginBottom: 'calc(40vh - 80px)',
      ...style
    }
  }

  return (
    <div
      class={c(
        'tc animate-fade-in animate--delay animate--fast',
        className
      )}
      style={style}
      {...rest}
    >
      {label &&
        <Heading
          class='animate-pulse animate--normal animate--infinite'
        >
          {label}…
        </Heading>}
      <Image alt='Loading…' src='/img/icon-loader.svg' />
    </div>
  )
}

export default Loader

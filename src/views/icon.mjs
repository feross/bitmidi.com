import { h } from 'preact' /** @jsx h */

import c from 'classnames'

const Icon = props => {
  const {
    name,
    class: className,
    size = 24,
    ...rest
  } = props

  return (
    <i
      class={c('material-icons', className)}
      style={{
        fontSize: size
      }}
      {...rest}
    >
      {name}
    </i>
  )
}

export default Icon

import { h } from 'preact' /** @jsx h */

import Image from './image'

const Icon = (props) => {
  const { name, alt, ...rest } = props
  return (
    <Image
      src={`./img/icon-${name}.svg`}
      alt={alt || name}
      {...rest}
    />
  )
}

export default Icon

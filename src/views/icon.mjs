import { h } from 'preact' /** @jsx h */

import Image from './image'

export default const Icon = (props) => {
  const { name, alt, ...rest } = props
  return (
    <Image
      src={`./img/icon-${name}.svg`}
      alt={alt || name}
      {...rest}
    />
  )
}

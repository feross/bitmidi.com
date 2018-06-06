import { h } from 'preact' /** @jsx h */
import c from 'classnames'

const Heading = (props) => {
  const { children, class: className, ...rest } = props

  return (
    <h1 class={c('mv2 f3', className)} {...rest}>
      {children}
    </h1>
  )
}

export default Heading

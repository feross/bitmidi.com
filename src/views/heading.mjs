import { h } from 'preact' /** @jsx h */
import c from 'classnames'

const Heading = props => {
  const {
    children,
    class: className,
    level = 1,
    ...rest
  } = props

  const HeadingElement = `h${level}`

  return (
    <HeadingElement class={c('mv2 f3', className)} {...rest}>
      {children}
    </HeadingElement>
  )
}

export default Heading

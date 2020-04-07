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

  const fontSizes = ['f3', 'f4', 'f5', 'f6', 'f6']

  return (
    <HeadingElement class={c('mv3', fontSizes[level - 1], className)} {...rest}>
      {children}
    </HeadingElement>
  )
}

export default Heading

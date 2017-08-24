const { h } = require('preact') /** @jsx h */
const c = require('classnames')

const Link = (props) => {
  const {
    children,
    class: className,
    href = '#',
    onClick = () => {},
    ...rest
  } = props

  return (
    <a
      class={c('link', className)}
      href={href}
      onClick={e => {
        if (href === '#') e.preventDefault()
        onClick(e)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}

module.exports = Link

const { h } = require('preact') /** @jsx h */
const c = require('classnames')

const Link = (props) => {
  const {
    children,
    class: className,
    href,
    onClick,
    external = false, /* router should not capture click */
    newtab = false, /* open link in new tab */
    ...rest
  } = props

  return (
    <a
      class={c('link', className)}
      href={href}
      onClick={onClick}
      rel={c(external && 'external', newtab && 'noopener')}
      target={newtab ? '_blank' : null}
      {...rest}
    >
      {children}
    </a>
  )
}

module.exports = Link

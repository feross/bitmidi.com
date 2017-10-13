const { h } = require('preact') /** @jsx h */
const c = require('classnames')

const Link = (props, context) => {
  const {
    color = context.theme.mainColor,
    children,
    class: className,
    href,
    onClick,
    external = false, /* router should not capture click */
    newtab = false, /* open link in new tab */
    underlineHover = true,
    ...rest
  } = props

  const cls = underlineHover ? 'underline-hover' : ''

  return (
    <a
      class={c('link', color, cls, className)}
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

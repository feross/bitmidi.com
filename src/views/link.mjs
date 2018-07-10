import { h } from 'preact' /** @jsx h */
import c from 'classnames'

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
      class={c('pointer no-underline', color, cls, className)}
      href={href}
      onClick={onClick}
      rel={c(external && 'external', newtab && 'noopener') || null}
      target={newtab ? '_blank' : null}
      {...rest}
    >
      {children}
    </a>
  )
}

export default Link

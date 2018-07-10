import { Component, h } from 'preact' /** @jsx h */
import c from 'classnames'

export default class Link extends Component {
  render (props) {
    const { theme } = this.context
    const {
      color = theme.mainColor,
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
        onClick={onClick && this.onClick}
        rel={c(external && 'external', newtab && 'noopener') || null}
        target={newtab ? '_blank' : null}
        {...rest}
      >
        {children}
      </a>
    )
  }

  onClick = e => {
    const { onClick } = this.props
    if (onClick) {
      e.stopPropagation()
      e.preventDefault()
      onClick(e)
    }
  }
}

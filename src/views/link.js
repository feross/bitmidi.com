import { Component } from 'preact'
import c from 'classnames'

export default class Link extends Component {
  render (props, _, { theme }) {
    const { store } = this.context

    const {
      color = store.app.colorScheme === 'light' ? theme.mainColor : theme.headerColor,
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

    if (href == null && onClick == null) {
      throw new Error('Prop `href` and `onClick` are missing, one is required')
    }

    return (
      <a
        class={c('pointer no-underline fw4', color, cls, className)}
        href={href}
        rel={c(external && 'external', newtab && 'noopener') || null}
        target={newtab ? '_blank' : null}
        onClick={onClick && this.onClick}
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

import c from 'classnames'

import Link from './link'

const Button = (props, { theme }) => {
  const {
    children,
    class: className,
    color = theme.mainColor,
    disabled = false,
    fill = false,
    href,
    onClick,
    pill = false,
    size = 'medium',
    style = {},
    ...rest
  } = props

  const cls = ['pointer dib ttu fw6 v-mid ba bw1 sans-serif grow']

  if (size === 'small') cls.push('f6 ph2 pv1')
  if (size === 'medium') cls.push('f5 ph2 pv2')
  if (size === 'large') cls.push('f4 ph4 pv3')

  if (fill) cls.push('white', `bg-${color}`, `b--${color}`)
  else cls.push(color)

  if (pill) cls.push('br-pill')
  else cls.push('br2')

  if (disabled) cls.push('o-60')

  let ButtonElement, elemProps

  if (href == null) {
    ButtonElement = 'button'
    elemProps = {
      disabled,
      type: 'button'
    }
    style['line-height'] = 'inherit'
  } else {
    ButtonElement = Link
    elemProps = {
      color: null,
      underlineHover: false
    }
  }

  return (
    <ButtonElement
      class={c(...cls, className)}
      href={href}
      style={style}
      onClick={onClick}
      {...elemProps}
      {...rest}
    >
      {children}
    </ButtonElement>
  )
}

export default Button

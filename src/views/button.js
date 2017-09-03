const { h } = require('preact') /** @jsx h */
const c = require('classnames')

const Link = require('./link')

/**
 * Basic Button
 * http://tachyons.io/components/buttons/basic/index.html
 *
 * Pill Button
 * http://tachyons.io/components/buttons/pill/index.html
 */

const Button = (props, context) => {
  const {
    children,
    class: className,
    color = context.theme.mainColor,
    disabled = false,
    fill = false,
    href,
    onClick,
    pill = false,
    size = 'small',
    style = {},
    ...rest
  } = props

  const cls = ['link pointer dib ttu fw6 grow v-mid ba bw1 sans-serif']

  if (size === 'small') cls.push('f6 ph3 pv2')
  if (size === 'medium') cls.push('f5 ph3 pv2')
  if (size === 'large') cls.push('f4 ph4 pv3')

  if (fill) cls.push('white', `bg-${color}`, `b--${color}`)
  else cls.push(color)

  if (pill) cls.push('br-pill')
  else cls.push('br3')

  if (disabled) cls.push('o-60')

  let ButtonElement = Link

  if (href == null) {
    ButtonElement = 'button'
    style['line-height'] = 'inherit'
  }

  return (
    <ButtonElement
      class={c(cls, className)}
      disabled={ButtonElement === 'button' && disabled}
      href={href}
      onClick={onClick}
      style={style}
      type={ButtonElement === 'button' && 'button'}
      {...rest}
    >
      {children}
    </ButtonElement>
  )
}

module.exports = Button

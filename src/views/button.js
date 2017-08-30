const { h } = require('preact') /** @jsx h */
const c = require('classnames')

const Link = require('./Link')

/**
 * Basic Button
 * http://tachyons.io/components/buttons/basic/index.html
 *
 * Pill Button
 * http://tachyons.io/components/buttons/pill/index.html
 */

const Button = (props) => {
  const {
    children,
    class: className,
    color = 'dark-pink',
    disabled = false,
    fill = false,
    href,
    onClick,
    pill = false,
    size = 'small',
    style = {},
    ...rest
  } = props

  const cls = ['link pointer dib ttu fw6 grow v-mid ba']

  if (size === 'small') cls.push('f6 ph3 pv2')
  if (size === 'medium') cls.push('f5 ph3 pv2')
  if (size === 'large') cls.push('f3 ph4 pv3')

  if (fill) cls.push('white', `bg-${color}`, `b--${color}`)
  else cls.push(color)

  if (pill) cls.push('br-pill')
  else cls.push('br3')

  if (disabled) cls.push('opacity-60')

  let ButtonElement = Link

  if (href == null) {
    ButtonElement = 'button'
    cls.push('bn')
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

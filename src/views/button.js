const { h } = require('preact') /** @jsx h */
const c = require('classnames')

// const Link = require('./Link') // TODO: convert to use Link

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
    href = '#',
    onClick = () => {},
    pill = false,
    size = 'small',
    style = {},
    ...rest
  } = props

  const cls = ['link pointer dib ttu fw6 grow v-btm']

  if (size === 'small') cls.push('f6 ph3 pv2')
  if (size === 'medium') cls.push('f5 ph3 pv2')
  if (size === 'large') cls.push('f3 ph4 pv3')

  if (fill) cls.push('white', `bg-${color}`)
  else cls.push('ba', color)

  if (pill) cls.push('br-pill')
  else cls.push('br3')

  if (disabled) cls.push('opacity-60')

  let ButtonElement
  if (href === '#') {
    ButtonElement = 'button'
    cls.push('bn')
    style['line-height'] = 'inherit'
  } else {
    ButtonElement = 'a'
  }

  return (
    <ButtonElement
      class={c(cls, className)}
      style={style}
      disabled={disabled}
      href={href}
      onClick={e => {
        if (href === '#') e.preventDefault()
        onClick()
      }}
      {...rest}
    >
      {children}
    </ButtonElement>
  )
}

module.exports = Button

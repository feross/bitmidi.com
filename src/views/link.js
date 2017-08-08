const { h } = require('preact') /** @jsx h */
const c = require('classnames')

const Link = (props) => {
  const {
    href = '#',
    onClick = () => {}
  } = props

  return (
    <a
      class={c('link', props.class)}
      href={href}
      onClick={e => {
        if (href === '#') e.preventDefault()
        onClick(e)
      }}
      style={props.style}
    >
      {props.children}
    </a>
  )
}

module.exports = Link

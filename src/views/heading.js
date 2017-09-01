const { h } = require('preact') /** @jsx h */
const c = require('classnames')

const Heading = (props) => {
  const { children, class: className, ...rest } = props

  return (
    <h1 class={c('mv2 f3', className)} {...rest}>
      {children}
    </h1>
  )
}

module.exports = Heading

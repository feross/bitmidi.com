const { h } = require('preact') /** @jsx h */

const Heading = (props) => {
  const { children, ...rest } = props

  return (
    <h2 {...rest}>
      {children}
    </h2>
  )
}

module.exports = Heading

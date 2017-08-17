const { h } = require('preact') /** @jsx h */

const Heading = (props) => {
  return (
    <h2>
      {props.children}
    </h2>
  )
}

module.exports = Heading

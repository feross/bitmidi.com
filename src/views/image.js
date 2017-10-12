const { h } = require('preact') /** @jsx h */

const Image = (props) => {
  const { alt, ...rest } = props

  if (typeof alt !== 'string' || alt.length === 0) {
    throw new Error('"props.alt" must be a string of non-zero length')
  }

  return (
    <img
      alt={alt}
      {...rest}
    />
  )
}

module.exports = Image

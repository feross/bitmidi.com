const { h } = require('preact') /** @jsx h */

const Image = (props) => {
  const { alt, ...rest } = props

  if (typeof alt !== 'string' || alt.length === 0) {
    throw new Error('"props.alt" must be a string of non-zero length')
  }

  // Experimental async attribute, see: https://github.com/whatwg/html/issues/1920
  return (
    <img
      async
      alt={alt}
      {...rest}
    />
  )
}

module.exports = Image

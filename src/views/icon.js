const { h } = require('preact') /** @jsx h */

const Image = require('./image')

const Icon = (props) => {
  const { name, alt, ...rest } = props
  return (
    <Image
      src={`./img/icon-${name}.svg`}
      alt={alt || name}
      {...rest}
    />
  )
}

module.exports = Icon

const { h } = require('preact') /** @jsx h */

const Heading = require('./heading')

const NotFoundPage = (props, context) => {
  const { store } = context
  const { errors } = store

  const firstError = errors[0] || 'Page Not Found'

  return (
    <Heading>Error – {firstError}</Heading>
  )
}

module.exports = NotFoundPage

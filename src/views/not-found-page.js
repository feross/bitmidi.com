const { h } = require('preact') /** @jsx h */

const Heading = require('./heading')

const NotFoundPage = (props) => {
  return (
    <Heading>Error – Page Not Found</Heading>
  )
}

module.exports = NotFoundPage

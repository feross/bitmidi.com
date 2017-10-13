const { h } = require('preact') /** @jsx h */

const Link = require('./link')

const Footer = (props, context) => {
  const { location, userName } = context.store

  let $submitLink
  if (location.name !== 'submit') {
    $submitLink = [
      <Link href='/submit'>Add a snippet</Link>,
      <FooterDivider />
    ]
  }

  return (
    <footer id='footer' class='f6 silver w-100 cf mt5 mb4 tc'>
      <span>
        Built by <Link href='https://twitter.com/feross'>@feross</Link>
      </span>
      <FooterDivider />
      <span>
        Powered by <Link href='https://github.com/feross/nodefoo.com' newtab>open source</Link>
      </span>
      <FooterDivider />
      {$submitLink}
      <Link href={userName ? '/auth/twitter/logout' : '/auth/twitter'} external>
        { userName ? `Logout (${userName})` : 'Login with Twitter' }
      </Link>
    </footer>
  )
}

const FooterDivider = () => {
  return <span class='mh2'>•</span>
}

module.exports = Footer

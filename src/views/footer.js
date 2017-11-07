const { h } = require('preact') /** @jsx h */

const Link = require('./link')

const Footer = (props, context) => {
  const { location, userName } = context.store

  let $submitLink
  if (location.name !== 'submit') {
    $submitLink = [
      <FooterItem>
        <Link href='/submit'>Add a snippet</Link>
      </FooterItem>,
      <FooterDivider />
    ]
  }

  return (
    <footer
      class='f6 lh-copy silver w-100 mt5 mb4 tc'
      role='navigation'
    >
      <FooterItem>
        Built by <Link href='https://twitter.com/feross' newtab>@feross</Link>
      </FooterItem>
      <FooterDivider />

      <FooterItem>
        Powered by <Link href='https://github.com/feross/nodefoo.com' newtab>open source</Link>
      </FooterItem>
      <FooterDivider />

      {$submitLink}

      <FooterItem>
        <Link href={userName ? '/auth/twitter/logout' : '/auth/twitter'} external>
          { userName ? `Logout (${userName})` : 'Login with Twitter' }
        </Link>
      </FooterItem>

    </footer>
  )
}

const FooterItem = ({ children }) => {
  return <div class='dib nowrap mh2'>{children}</div>
}

const FooterDivider = () => {
  return <span class='mh1'>•</span>
}

module.exports = Footer

import { h } from 'preact' /** @jsx h */

import Link from './link'

const Footer = (props, context) => {
  return (
    <footer class='f6 lh-copy silver w-100 mt5 mb4 tc'>
      <FooterItem>
        Built by <Link href='https://twitter.com/feross' newtab>@feross</Link>
      </FooterItem>
      <FooterDivider />

      <FooterItem>
        Powered by <Link href='https://github.com/feross/bitmidi.com' newtab>open source</Link>
      </FooterItem>
      <FooterDivider />

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

export default Footer

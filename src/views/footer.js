const { h } = require('preact') /** @jsx h */

const Link = require('./link')

const Footer = (props, context) => {
  const { store } = context
  const { userName } = store

  let $submitLink
  if (store.location.name !== 'submit') {
    $submitLink = [
      <FooterLink href='/submit'>Add a snippet</FooterLink>,
      <FooterDivider />
    ]
  }

  return (
    <footer id='footer' class='gray w-100 cf mv5 tc'>
      <span>
        Built by <FooterLink href='https://twitter.com/feross'>@feross</FooterLink>
      </span>
      <FooterDivider />
      <span>
        Powered by <FooterLink href='https://github.com/feross/nodefoo.com' newtab>open source</FooterLink>
      </span>
      <FooterDivider />
      {$submitLink}
      <FooterLink href={userName ? '/auth/twitter/logout' : '/auth/twitter'} external>
        { userName ? `Logout (${userName})` : 'Login with Twitter' }
      </FooterLink>
    </footer>
  )
}

const FooterLink = (props) => {
  const { children, ...rest } = props
  return <Link class='light-red hover-dark-red underline-hover' {...rest}>{children}</Link>
}

const FooterDivider = () => {
  return <span class='mh2'>•</span>
}

module.exports = Footer

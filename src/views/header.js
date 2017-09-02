const { h } = require('preact') /** @jsx h */

const Button = require('./button')
const Link = require('./link')
const Search = require('./search')

const Header = (props, context) => {
  const { store, theme } = context
  const { location, userName } = store
  const { headerColor, mainColor } = theme

  let $submitButton
  if (location.name !== 'submit') {
    $submitButton = (
      <Button
        class='mh1'
        color={mainColor}
        fill
        href='/submit'
        pill
        size='medium'
      >
        Add a snippet ✨
      </Button>
    )
  }

  let $logoutButton
  if (userName) {
    $logoutButton = (
      <Button
        class='mh1'
        color={mainColor}
        href={'/auth/twitter/logout'}
        pill
        external
        size='medium'
      >
        Logout ({userName})
      </Button>
    )
  }

  return (
    <header
      id='header'
      class={`fixed z-2 top-0 w-100 shadow-1 cf ph2 ph3-m ph3-l bg-${headerColor} h3`}
      style={{
        height: 50,
        paddingTop: 6
      }}
    >
      <div class='fl w-third'>
        <Link href='/'>
          <div class='lh-copy white f3'>Node Foo</div>
        </Link>
      </div>
      <div class='fl w-third v-mid pl4 pr1 ph2-m ph0-l'>
        <Search class='w-100' />
      </div>
      <nav class='fl w-third dn db-m db-l v-mid tr'>
        {$submitButton}
        {$logoutButton}
      </nav>
    </header>
  )
}

module.exports = Header

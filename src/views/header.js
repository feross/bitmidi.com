const { h } = require('preact') /** @jsx h */

const Button = require('./button')
const Image = require('./image')
const Link = require('./link')
const Search = require('./search')

const Header = (props, context) => {
  const { location } = context.store
  const { headerColor, mainColor } = context.theme

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

  return (
    <header
      id='header'
      class={
        `fixed z-2 top-0 w-100 shadow-1 cf ph2 ph3-m ph3-l bg-${headerColor} h3`
      }
      style={{
        height: 50,
        paddingTop: 6
      }}
    >
      <div class='fl w-third'>
        <Link
          color='white'
          class='dib lh-copy white f3 grow'
          href='/'
        >
          <Image
            src='/img/nodefoo.svg'
            alt='Node Foo'
            style={{
              marginTop: 2,
              height: 36
            }}
          />
        </Link>
      </div>
      <div class='fl w-third v-mid pl4 pr1 ph2-m ph0-l'>
        <Search class='w-100' />
      </div>
      <nav class='fl w-third dn db-m db-l v-mid tr'>
        {$submitButton}
      </nav>
    </header>
  )
}

module.exports = Header

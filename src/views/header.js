const { h } = require('preact') /** @jsx h */

// const config = require('../../config')
const detect = require('../lib/detect')

const Button = require('./button')
const Link = require('./link')
const Search = require('./search')

const Header = (props) => {
  const statusBarHeight = detect.isSafariHomeApp
    ? 14
    : 0

  // <img
  //   style={{
  //     height: 40,
  //     marginTop: -1
  //   }}
  //   alt={config.name}
  //   src='/img/logo.svg'
  // />

  return (
    <header
      id='header'
      class='fixed z-2 top-0 w-100 shadow-1 cf ph2 ph3-m ph3-l bg-dark-pink'
      style={{
        height: 60 + statusBarHeight,
        paddingTop: 12 + statusBarHeight
      }}
    >
      <div class='fl w-third v-mid pl1'>
        <Link class='dib' href='/'>
          <div class='white f3'>NodeFoo</div>
        </Link>
      </div>
      <div class='fl w-two-thirds w-third-m w-third-l v-mid pl4 pr1 ph2-m ph0-l'>
        <Search class='w-100' />
      </div>
      <nav
        class='fl w-third dn db-m db-l v-mid tr'
        style={{
          marginTop: 2
        }}
      >
        <Button
          pill
          color='white'
          href='/submit'
          class='mh1'
          style={{ marginTop: -4 }}
        >
          Submit
        </Button>
        <Button
          pill
          color='white'
          href='/docs/fs/readfile'
          class='mh1'
          style={{ marginTop: -4 }}
        >
          Doc Page
        </Button>
      </nav>
    </header>
  )
}

module.exports = Header

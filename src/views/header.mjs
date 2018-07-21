import { h } from 'preact' /** @jsx h */
import c from 'classnames'

import { isBrowser, title } from '../config'

import Button from './button'
import Image from './image'
import Link from './link'
import Search from './search'

const Header = (props, context) => {
  const { app } = context.store
  const { headerColor } = context.theme

  const isPageLoading = !isBrowser || // initial server render
      app.pending > 0 || // fetching async data
      !app.isLoaded // window.onload() has not fired yet

  const headerCls = isPageLoading
    ? 'animate-bg-rainbow'
    : `bg-${headerColor}`

  return (
    <header
      class={c(headerCls, 'top-0 w-100 shadow-1 cf ph1 ph2-m ph2-l')}
      style={{
        height: 50,
        paddingTop: 6
      }}
    >
      <div class='center mw9'>
        <div class='fl w-third'>
          <HeaderLogo isPageLoading={isPageLoading} />
        </div>
        <div class='fl w-third v-mid pl4 pr1 ph2-m ph0-l'>
          <Search class='w-100' />
        </div>
        <nav class='fl w-third dn db-m db-l v-mid tr'>
          <RandomMidiButton />
        </nav>
      </div>
    </header>
  )
}

export default Header

const HeaderLogo = ({ isPageLoading }) => {
  const logoCls = isPageLoading &&
    'animate-pulse animate--normal animate--infinite'

  return (
    <Link
      color='white'
      class={c(logoCls, 'dib lh-copy white f3')}
      href='/'
    >
      <Image
        src='/img/bitmidi.svg'
        alt={title}
        style={{
          height: 39
        }}
      />
    </Link>
  )
}

const RandomMidiButton = () => {
  return (
    <Button
      class='mh1'
      fill
      size='medium'
      href='/random'
    >
      Random MIDI ✨
    </Button>
  )
}

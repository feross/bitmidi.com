import { h } from 'preact' /** @jsx h */
import c from 'classnames'

import { isBrowser, siteName } from '../config'

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
      class={c(headerCls, 'top-0 w-100 shadow-1 ph3 safe-padding flex justify-between')}
      style={{
        height: 50,
        paddingTop: 6,
        willChange: 'background, background-size'
      }}
    >
      <div class=''>
        <HeaderLogo isPageLoading={isPageLoading} />
      </div>
      <div class='flex-auto mh4 mw7'>
        <Search class='w-100' />
      </div>
      <nav class='tr'>
        <RandomMidiButton />
      </nav>
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
        alt={siteName}
        lazyload={false}
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
      Random <span class='dn di-l'>MIDI ✨</span>
    </Button>
  )
}

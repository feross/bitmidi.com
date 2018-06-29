import { h } from 'preact' /** @jsx h */
import c from 'classnames'

import config from '../../config'
import { doGoMidiRandom } from '../actions/midi'

import Button from './button'
import Image from './image'
import Link from './link'
import Search from './search'

const Header = (props, context) => {
  const { app } = context.store
  const { headerColor, mainColor } = context.theme
  const { dispatch } = context

  const isPageLoading = !config.isBrowser || // initial server render
      app.pending > 0 || // fetching async data
      !app.isLoaded // window.onload() has not fired yet

  let headerCls = ''
  let logoCls = ''

  if (isPageLoading) {
    headerCls = 'animate-bg-rainbow'
    logoCls = 'animate-pulse animate--normal animate--infinite'
  } else {
    headerCls = `bg-${headerColor}`
    logoCls = 'animate-bounce-in animate--normal'
  }

  return (
    <header
      class={c(headerCls, 'fixed z-2 top-0 w-100 shadow-1 cf ph2 ph3-m ph3-l h3')}
      style={{
        height: 50,
        paddingTop: 6
      }}
    >
      <div class='fl w-third'>
        <Link
          color='white'
          class={c(logoCls, 'dib lh-copy white f3')}
          href='/'
        >
          <Image
            src='/img/bitmidi.png'
            alt={config.title}
            style={{
              marginTop: 2,
              height: 36,
              width: 132
            }}
          />
        </Link>
      </div>
      <div class='fl w-third v-mid pl4 pr1 ph2-m ph0-l'>
        <Search class='w-100' />
      </div>
      <nav class='fl w-third dn db-m db-l v-mid tr'>
        <Button
          class='mh1'
          color={mainColor}
          fill
          pill
          size='medium'
          onClick={() => dispatch(doGoMidiRandom())}
        >
          Random MIDI ✨
        </Button>
      </nav>
    </header>
  )
}

export default Header

import { h } from 'preact' /** @jsx h */

import Link from './link'
import { HorizListItem, HorizListDivider } from './horiz-list'

const Footer = (props, context) => {
  const { app } = context.store

  // Hide footer while page is loading
  if (app.pending > 0) return null

  return (
    <footer class='f6 lh-copy mid-gray mw7 center mt4 mb4 tc'>
      <HorizListItem>
        <Link href='/about'>
          About BitMidi
        </Link>
      </HorizListItem>

      <HorizListDivider />

      <HorizListItem>
        <Link href='/random'>Random MIDI</Link>
      </HorizListItem>

      <HorizListDivider />

      <HorizListItem>
        <Link href='https://twitter.com/bitmidi' newtab>
          @BitMidi
        </Link>
      </HorizListItem>

      <HorizListDivider />

      <HorizListItem>
        Built by Feross
      </HorizListItem>
    </footer>
  )
}

export default Footer

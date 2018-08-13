import { h } from 'preact' /** @jsx h */

import Link from './link'
import { HorizListItem, HorizListDivider } from './horiz-list'

const Footer = (props, context) => {
  return (
    <footer class='f6 lh-copy gray w-100 mt5 mb4 tc'>
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

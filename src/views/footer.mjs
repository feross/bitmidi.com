import { h } from 'preact' /** @jsx h */

import Link from './link'
import { HorizListItem, HorizListDivider } from './horiz-list'

const Footer = (props, context) => {
  return (
    <footer class='f6 lh-copy silver w-100 mt5 mb4 tc'>
      <HorizListItem>
        Built by <Link href='https://twitter.com/feross' newtab>@feross</Link>
      </HorizListItem>
      <HorizListDivider />

      <HorizListItem>
        Thanks to <Link href='https://feross.org/thanks/' newtab>my supporters</Link>
      </HorizListItem>
      <HorizListDivider />

      <HorizListItem>
        Powered by <Link href='https://github.com/feross/bitmidi.com' newtab>open source</Link>
      </HorizListItem>
    </footer>
  )
}

export default Footer

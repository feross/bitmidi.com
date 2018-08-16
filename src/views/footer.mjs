import { h } from 'preact' /** @jsx h */

import { siteTwitter } from '../config'

import Link from './link'
import { HorizListItem, HorizListDivider } from './horiz-list'

const TIPS = [
  <span>You can drag-and-drop a MIDI file onto this page to play it!</span>,
  <span>
    This project is open source on{' '}
    <Link href='https://github.com/feross/bitmidi.com' newtab>GitHub</Link>!
  </span>,
  <span>
    We tweet a new MIDI every day.{' '}
    <Link href={`https://twitter.com/${siteTwitter}`} newtab>Follow @{siteTwitter}</Link>{' '}
    on Twitter!
  </span>
]

const Footer = (props, context) => {
  const { app } = context.store

  // Hide footer while page is loading
  if (app.pending > 0) return null

  return (
    <footer class='f6 lh-copy mid-gray mv4 ph3 ph3-safe mw7 center tc'>
      <div class='mv3'>
        <RandomTip />
      </div>
      <div class='mv3'>
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
          <Link href={`https://twitter.com/${siteTwitter}`} newtab>
            @BitMidi
          </Link>
        </HorizListItem>

        <HorizListDivider />

        <HorizListItem>
          Built by Feross
        </HorizListItem>
      </div>
    </footer>
  )
}

const RandomTip = () => {
  const tip = TIPS[Math.floor(TIPS.length * Math.random())]
  return (
    <span>
      <strong>Pro Tip</strong>: {tip}
    </span>
  )
}

export default Footer

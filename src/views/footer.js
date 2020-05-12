import { h } from 'preact' /** @jsx h */

import { siteTwitter } from '../config'

import Link from './link'
import Random from './random'
import { HorizListItem, HorizListDivider } from './horiz-list'

const Footer = (_, { store }) => {
  const { app } = store

  // Hide footer while page is loading
  if (app.pending > 0) return null

  return (
    <footer class='f6 lh-copy mid-gray mt4 mb6 ph3 ph3-safe mw7 center tc'>
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
          <Link newtab href={`https://twitter.com/${siteTwitter}`}>
            @BitMidi
          </Link>
        </HorizListItem>

        <HorizListDivider />

        <HorizListItem>
          <Link href='/privacy'>
            Privacy
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
  return (
    <span>
      <strong>Pro Tip</strong>:{' '}
      <Random>
        <span>
          You can drag-and-drop a MIDI file onto this page to play it!
        </span>
        <span>
          This project is open source on{' '}
          <Link newtab href='https://github.com/feross/bitmidi.com'>GitHub</Link>!
        </span>
        <span>
          We tweet a new MIDI every day.{' '}
          <Link newtab href={`https://twitter.com/${siteTwitter}`}>
            Follow @{siteTwitter}
          </Link>{' '}
          on Twitter!
        </span>
        <span>
          We are on Reddit at <Link newtab href='https://www.reddit.com/r/BitMidi'>r/BitMidi</Link>!
        </span>
        <span>
          Chat with other MIDI fans on our <Link newtab href='https://discord.gg/5uD9Ktf'>Discord server</Link>!
        </span>
      </Random>
    </span>
  )
}

export default Footer

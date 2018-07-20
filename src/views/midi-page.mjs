import { h } from 'preact' /** @jsx h */
import oneLine from 'common-tags/lib/oneLine'

import { title } from '../config'
import { doMidiGet } from '../actions/midi'

import Heading from './heading'
import Link from './link'
import Loader from './loader'
import Midi from './midi'
import Page from './page'
import RelativeTime from './relative-time'
import { HorizListItem, HorizListDivider } from './horiz-list'

export default class MidiPage extends Page {
  async load () {
    const { store, dispatch } = this.context
    const { midiSlug } = store.location.params

    const { result } = await dispatch(doMidiGet({ slug: midiSlug }))

    dispatch('APP_META', {
      title: result.name,
      description: oneLine`
        Listen to ${result.name}, a free MIDI file on ${title}. Play, download, or share the MIDI song ${result.name} from your web browser.
      `
    })
  }

  render (props) {
    const { store } = this.context
    const { data } = store
    const { midiSlug } = store.location.params

    if (!this.loaded) {
      return <Loader center label={`Loading ${midiSlug}`} />
    }

    const midi = data.midis[midiSlug]

    return (
      <div>
        <Heading>{midi.name}</Heading>
        <MidiMetadata midi={midi} />
        <Midi midi={midi} />

        <h3>Play now</h3>
        <p>
          Tap the play button above to play this MIDI file now.
        </p>

        <h3>Download this MIDI file</h3>
        <Link download={midi.name} href={midi.downloadUrl}>
          Download {midi.name}
        </Link>

        { midi.alternateNames &&
          <div>
            <h3>This MIDI file has alternate names</h3>
            <ul>
              { midi.alternateNames.map(name => <li>{name}</li>) }
              <li>{midi.name}</li>
            </ul>
          </div>
        }
      </div>
    )
  }
}

const MidiMetadata = ({ midi }) => {
  return (
    <div>
      <HorizListItem>
        Uploaded <RelativeTime datetime={midi.createdAt} />
      </HorizListItem>
      <HorizListDivider />
      <HorizListItem>
        {midi.plays} plays
      </HorizListItem>
      <HorizListDivider />
      <HorizListItem>
        {midi.views} page views
      </HorizListItem>
    </div>
  )
}

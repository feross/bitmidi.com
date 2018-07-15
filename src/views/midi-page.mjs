import { h } from 'preact' /** @jsx h */

import { doMidiGet } from '../actions/midi'

import Heading from './heading'
import Link from './link'
import Loader from './loader'
import Midi from './midi'
import PageComponent from './page-component'
import RelativeTime from './relative-time'
import { HorizListItem, HorizListDivider } from './horiz-list'

export default class MidiPage extends PageComponent {
  async load () {
    const { store, dispatch } = this.context
    const { midiSlug } = store.location.params

    const { result } = await dispatch(doMidiGet({ slug: midiSlug }))

    dispatch('APP_META', {
      title: result.name,
      description: `Listen to ${result.name}`
    })
  }

  render (props) {
    const { store } = this.context
    const { data } = store
    const { midiSlug } = store.location.params

    const midi = data.midis[midiSlug]

    if (midi == null) return <Loader center />

    return (
      <div>
        <Heading>{midi.name}</Heading>
        <div>
          <HorizListItem>
            Uploaded <RelativeTime time={midi.createdAt} />
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
          <h3>This MIDI file has alternate names</h3>
        }
        {
          midi.alternateNames &&
          <ul>
            { midi.alternateNames.map(name => <li>{name}</li>) }
            <li>{midi.name}</li>
          </ul>
        }
      </div>
    )
  }
}

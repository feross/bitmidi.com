import { h } from 'preact' /** @jsx h */
import oneLine from 'common-tags/lib/oneLine'

import { origin, siteName } from '../config'
import { doMidiGet } from '../actions/midi'

import { MidiPageAd, OptimizeLeaderboardBTF } from './ads'
import Button from './button'
import Heading from './heading'
import Link from './link'
import Loader from './loader'
import Midi from './midi'
import Page from './page'
import RelativeTime from './relative-time'
import ShareButton from './share-button'
import { HorizListItem, HorizListDivider } from './horiz-list'

export default class MidiPage extends Page {
  async load () {
    const { store, dispatch } = this.context
    const { midiSlug } = store.location.params

    const { result: midi } = await dispatch(doMidiGet({ slug: midiSlug }))

    if (midiSlug.toLowerCase() !== midiSlug) {
      return dispatch('LOCATION_REPLACE', midi.url)
    }

    dispatch('APP_META', {
      title: midi.name,
      description: oneLine`
        Listen to ${midi.name}, a free MIDI file on ${siteName}. Play, download, or share the MIDI song ${midi.name} from your web browser.
      `,
      image: midi.image,
      meta: {
        'twitter:card': 'player',
        'twitter:player': `${origin}/embed/${midiSlug}`,
        'twitter:player:height': '300',
        'twitter:player:width': '740'
      }
    })
  }

  render (props, _, { store }) {
    const { data, views } = store
    const { colorScheme } = store.app
    const { midiSlug } = store.location.params

    if (!this.loaded) {
      return <Loader center label={`Loading ${midiSlug}`} />
    }

    const midi = data.midis[midiSlug]

    const relatedMidis = views.related[midi.slug] &&
      views.related[midi.slug]
        .map(relatedMidiSlug => data.midis[relatedMidiSlug])

    return (
      <div>
        <div>
          <div class='dib w-90'>
            <Heading>{midi.name}</Heading>
            <MidiMetadata midi={midi} />
          </div>
          <div class='fr w-10 tr'>
            <ShareButton
              class='mt2'
              color={colorScheme === 'light' ? 'black' : 'white'}
            />
          </div>
        </div>

        <div class='mv4'>
          <Midi midi={midi} />
        </div>

        <div class='cf'>
          <div class='fn fl-ns w-50-ns'>
            <h3>🎶 Play now</h3>
            <p>
              Tap the play button above! ☝️
            </p>

            <h3>💿 Download this MIDI file</h3>
            <p>
              <Link download={midi.name} href={midi.downloadUrl}>
                Download {midi.name}
              </Link>
            </p>
          </div>
          <MidiPageAd class='fn fl-ns w-50-ns pl3-ns' />
        </div>

        {midi.alternateNames &&
          <div>
            <h3>This MIDI file has alternate names</h3>
            <p>
              <ul>
                {midi.alternateNames.map(name => <li key={name}>{name}</li>)}
                <li>{midi.name}</li>
              </ul>
            </p>
          </div>}

        {relatedMidis &&
          <div class='mv4'>
            <Heading>Related MIDI Files <small>(they will blow your mind! 😳💥😵)</small></Heading>
            {
              relatedMidis.map(midi => {
                return <Midi key={midi.slug} midi={midi} showImage={false} showPlay={false} />
              })
            }
            <div class='tc'>
              <Button
                class='center'
                href={`/${midi.slug}/related`}
              >
                More Related
              </Button>
            </div>
          </div>}

        <OptimizeLeaderboardBTF />
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

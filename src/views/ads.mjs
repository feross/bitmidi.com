import { h } from 'preact' /** @jsx h */

import Adsense from './adsense'
import Random from './random'

export const MidiPageAd = props => (
  <Adsense
    data-ad-format='auto'
    data-ad-slot='2581488270'
    data-full-width-responsive='true'
    {...props}
  />
)

const MidiFeedAd1 = props => (
  <Adsense
    data-ad-format='fluid'
    data-ad-slot='8705178963'
    data-ad-layout-key='-hw+i-1a-5c+ee'
    {...props}
  />
)

const MidiFeedAd2 = props => (
  <Adsense
    data-ad-format='fluid'
    data-ad-slot='7805609385'
    data-ad-layout-key='-79+f1-x-5g+d5'
    {...props}
  />
)

export const MidiFeedAd = props => (
  <Random>
    <MidiFeedAd1 {...props} />
    <MidiFeedAd2 {...props} />
  </Random>
)

export const RelatedMidiAd = props => (
  <Adsense
    data-ad-slot='3309382058'
    data-ad-format='link'
    data-full-width-responsive='true'
    {...props}
  />
)

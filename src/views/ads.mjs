import { h } from 'preact' /** @jsx h */

import Adsense from './adsense'
import Random from './random'

export const MidiPageAd = () => (
  <Adsense
    data-ad-slot='2581488270'
    data-ad-format='auto'
    data-full-width-responsive='true'
  />
)

const MidiFeedAd1 = () => (
  <Adsense
    data-ad-slot='8705178963'
    data-ad-format='fluid'
    data-ad-layout-key='-i0+j-1k-55+f9'
  />
)

const MidiFeedAd2 = () => (
  <Adsense
    data-ad-slot='7805609385'
    data-ad-format='fluid'
    data-ad-layout-key='-7d+f1-x-5g+d5'
  />
)

export const MidiFeedAd = () => (
  <Random>
    <MidiFeedAd1 />
    <MidiFeedAd2 />
  </Random>
)

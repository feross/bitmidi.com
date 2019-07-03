import { h } from 'preact' /** @jsx h */

import Adsense from './adsense'
import CarbonAd from './carbon-ad'
import Random from './random'

const AdsenseDisplay1 = props => (
  <Adsense
    data-ad-format='auto'
    data-ad-slot='2581488270'
    data-full-width-responsive='true'
    {...props}
  />
)

// const AdsenseFeed1 = props => (
//   <Adsense
//     data-ad-format='fluid'
//     data-ad-slot='8705178963'
//     data-ad-layout-key='-hw+i-1a-5c+ee'
//     {...props}
//   />
// )

const AdsenseFeed2 = props => (
  <Adsense
    data-ad-format='fluid'
    data-ad-slot='7805609385'
    data-ad-layout-key='-79+f1-x-5g+d5'
    {...props}
  />
)

// export const AdsenseLink1 = props => (
//   <Adsense
//     data-ad-slot='3309382058'
//     data-ad-format='link'
//     data-full-width-responsive='true'
//     {...props}
//   />
// )

// Carbon does not allow other ads on the same page, so when <Random> selects
// index 1 (i.e. Carbon), ensure that an empty <div> is shown in the second unit
export const MidiPageAd = props => (
  <Random>
    <AdsenseDisplay1 {...props} />
    <CarbonAd {...props} />
  </Random>
)

export const MidiPageAd2 = props => (
  <Random>
    <AdsenseDisplay1 {...props} />
    <div />
  </Random>
)

export const MidiFeedAd = props => (
  <Random>
    <AdsenseDisplay1 {...props} />
    <AdsenseFeed2 {...props} />
  </Random>
)

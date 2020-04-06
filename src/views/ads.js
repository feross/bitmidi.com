import { h } from 'preact' /** @jsx h */

// import Adsense from './adsense'
import CarbonAd from './carbon-ad'
// import Random from './random'

// /8691100/BitMidi_S2S_Leaderboard_ATF
export const OptimizeLeaderboardATF = props => (
  <div id='bsa-zone_1579198275278-0_123456' />
)

export const MidiPageAd = props => (
  <CarbonAd {...props} />
)

export const MidiFeedTopAd = props => (
  <CarbonAd {...props} />
)

export const MidiFeedAd = props => (
  null
)

// const AdsenseDisplay1 = props => (
//   <Adsense
//     data-ad-format='auto'
//     data-ad-slot='2581488270'
//     data-full-width-responsive='true'
//     {...props}
//   />
// )

// const AdsenseFeed1 = props => (
//   <Adsense
//     data-ad-format='fluid'
//     data-ad-slot='8705178963'
//     data-ad-layout-key='-hw+i-1a-5c+ee'
//     {...props}
//   />
// )

// const AdsenseFeed2 = props => (
//   <Adsense
//     data-ad-format='fluid'
//     data-ad-layout-key='-79+f1-x-5g+d5'
//     data-ad-slot='7805609385'
//     {...props}
//   />
// )

// const AdsenseLink1 = props => (
//   <Adsense
//     data-ad-slot='3309382058'
//     data-ad-format='link'
//     data-full-width-responsive='true'
//     {...props}
//   />
// )

// Carbon does not allow other ads on the same page, so when <Random> selects
// index 1 (i.e. Carbon), ensure that an empty <div> is shown in the second unit
// export const MidiFeedTopAd = props => (
//   <Random>
//     <AdsenseDisplay1 {...props} />
//     <CarbonAd {...props} />
//   </Random>
// )

// export const MidiFeedAd = props => (
//   <Random>
//     <AdsenseDisplay1 {...props} />
//     <div />
//   </Random>
// )

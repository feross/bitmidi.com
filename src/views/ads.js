import { h } from 'preact' /** @jsx h */

// import Adsense from './adsense'
// import CarbonAd from './carbon-ad'
import NeworAd from './newor-ad'
import OptimizeAd from './optimize-ad'
import c from 'classnames'
// import Random from './random'

/**
 * Ad-network specific ads
 */

export const OptimizeLeaderboardATF = props => (
  <OptimizeAd id='bsa-zone_1579198275278-0_123456' {...props} />
)

export const OptimizeLeaderboardMid = props => (
  <OptimizeAd id='bsa-zone_1579198330476-0_123456' {...props} />
)

export const OptimizeLeaderboardBTF = props => (
  <OptimizeAd id='bsa-zone_1579198373191-8_123456' {...props} />
)

export const OptimizeLeftRailATF = props => (
  <OptimizeAd id='bsa-zone_1579198421810-5_123456' {...props} />
)

export const OptimizeRightRailATF = props => (
  <OptimizeAd id='bsa-zone_1579198463316-9_123456' {...props} />
)

export const NeworLeaderboard = ({ class: className, rest }) => (
  // 728x90/970x90/320x50
  <NeworAd id='waldo-tag-7780' class={c('newor-ad-overflow-fix', className)} {...rest} />
)

export const NeworLeaderboardLarge = ({ class: className, rest }) => (
  // 728x90/970x90/970x250/320x50
  <NeworAd id='waldo-tag-7782' class={c('newor-ad-overflow-fix', className)} {...rest} />
)

export const NeworSquare = ({ class: className, rest }) => (
  // 300x250/300x600
  <NeworAd id='waldo-tag-7781' class={c('newor-ad-overflow-fix', className)} {...rest} />
)

export const NeworStickyFooter = props => (
  // 728x90/320x50 sticky footer
  <div id='waldo-sticky-footer-wrapper'>
    <div id='waldo-sticky-footer-inner'>
      <NeworAd id='waldo-tag-7783' {...props} />
    </div>
  </div>
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

/**
 * Midi page ads
 */

export const MidiPageTopAd = props => (
  // <OptimizeRightRailATF {...props} />
  <NeworLeaderboard {...props} />
  // <CarbonAd {...props} />
)

export const MidiPageAd = props => (
  // <OptimizeLeaderboardBTF {...props} />
  <NeworLeaderboardLarge {...props} />
)

/**
 * Midi feed ads
 */

export const MidiFeedTopAd = props => (
  // <OptimizeLeaderboardATF {...props} />
  <NeworLeaderboard {...props} />
  // <CarbonAd {...props} />
)

export const MidiFeedAd = props => (
  // <OptimizeLeaderboardMid {...props} />
  <NeworLeaderboardLarge {...props} />
)

/**
 * Page level ads
 */

export const SidebarAd = ({ class: className, rest }) => (
  <div class={c('dn db-l absolute', className)} style={{ marginLeft: '48rem' }} {...rest}>
    <NeworSquare />
  </div>
)

export const PageLevelAd = props => (
  // <div />
  <NeworStickyFooter {...props} />
)

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

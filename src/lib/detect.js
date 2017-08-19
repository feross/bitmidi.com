const IS_BROWSER = typeof window !== 'undefined'

exports.isSafariHomeApp = IS_BROWSER &&
  window.navigator.standalone === true
exports.isChromeHomeApp = IS_BROWSER &&
  window.matchMedia('(display-mode: standalone)').matches

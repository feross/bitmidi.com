// TODO: publish to npm

module.exports = debugHelper

function debugHelper (enable, verbose) {
  window.localStorage.debug = enable && verbose ? '*' : enable ? '*,-*verbose*' : ''
  window.location.reload()
}

// TODO: publish to npm

export default function debugHelper (enable, verbose) {
  window.localStorage.debug = enable && verbose
    ? '*'
    : enable
      ? '*,-*verbose*'
      : ''
  window.location.reload()
}

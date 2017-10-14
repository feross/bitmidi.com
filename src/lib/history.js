// TODO: publish to npm

const IS_BROWSER = typeof window !== 'undefined'

class History {
  constructor (onChange) {
    this._onChange = onChange
    if (IS_BROWSER) window.addEventListener('popstate', this._onPopState)
  }

  push (url) {
    if (IS_BROWSER) window.history.pushState(undefined, undefined, url)
    this._onChange(url)
  }

  replace (url) {
    if (IS_BROWSER) window.history.replaceState(undefined, undefined, url)
    this._onChange(url)
  }

  back () {
    if (IS_BROWSER) window.history.back()
  }

  forward () {
    if (IS_BROWSER) window.history.forward()
  }

  destroy () {
    this._onChange = null

    if (IS_BROWSER) window.removeEventListener('popstate', this._onPopState)
    this._onPopState = null
  }

  _onPopState = (e) => {
    const loc = window.location
    const url = loc.pathname + loc.search + loc.hash
    this._onChange(url)
  }
}

module.exports = History

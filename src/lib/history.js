// TODO: publish to npm

const IS_BROWSER = typeof window !== 'undefined'

class History {
  constructor (onChange) {
    this._onChange = onChange
    this._onPopState = this._onPopState.bind(this)
    if (IS_BROWSER) window.addEventListener('popstate', this._onPopState)
  }

  push (pathname) {
    if (IS_BROWSER) window.history.pushState(undefined, undefined, pathname)
    this._onChange(pathname)
  }

  replace (pathname) {
    if (IS_BROWSER) window.history.replaceState(undefined, undefined, pathname)
    this._onChange(pathname)
  }

  back () {
    if (IS_BROWSER) window.history.back()
  }

  forward () {
    if (IS_BROWSER) window.history.forward()
  }

  destroy () {
    this._onChange = null
    this._onPopState = null
    if (IS_BROWSER) window.removeEventListener('popstate', this._onPopState)
  }

  _onPopState (e) {
    this._onChange(window.location.pathname)
  }
}

module.exports = History

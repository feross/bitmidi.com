// TODO: publish to npm

class History {
  constructor (onChange) {
    this._onChange = onChange
    this._onPopState = this._onPopState.bind(this)
    window.addEventListener('popstate', this._onPopState)
  }

  push (pathname) {
    window.history.pushState(undefined, undefined, pathname)
    this._onChange(window.location.pathname, 'push')
  }

  replace (pathname) {
    window.history.replaceState(undefined, undefined, pathname)
    this._onChange(window.location.pathname, 'replace')
  }

  back () {
    window.history.back()
  }

  forward () {
    window.history.forward()
  }

  destroy () {
    window.removeEventListener('popstate', this._onPopState)
    this._onChange = null
    this._onPopState = null
  }

  _onPopState (e) {
    this._onChange(window.location.pathname, 'popstate')
  }
}

module.exports = History

// TODO: publish to npm

import { render } from 'preact'

import renderToString from 'preact-render-to-string'
import undom from 'undom'

// Patch the global object with a barebones `document`
Object.assign(global, undom().defaultView)

export default function createRenderer (jsx) {
  const doc = undom()
  const parent = doc.createElement('x-root')
  doc.body.appendChild(parent)

  let renderWasCalled = false
  return {
    render: function () {
      renderWasCalled = true
      render(jsx, parent)
      return this
    },
    html: function () {
      if (!renderWasCalled) {
        throw new Error('render() was not called before html()')
      }
      return renderToString(jsx)
    }
  }
}

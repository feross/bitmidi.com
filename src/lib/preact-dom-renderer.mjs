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

  let root = null

  return {
    render: function () {
      root = render(jsx, parent, root)
      return this
    },
    html: function () {
      if (root == null) throw new Error('render() was not called before html()')
      return renderToString(jsx)
    }
  }
}

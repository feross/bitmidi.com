module.exports = createRenderer

var { render } = require('preact')
var undom = require('undom')

// Patch the global object with a barebones `document`
Object.assign(global, undom().defaultView)

function createRenderer () {
  const doc = undom()
  const parent = doc.createElement('x-root')

  doc.body.appendChild(parent)

  let root = null

  return {
    render: function (jsx) {
      root = render(jsx, parent, root)
      return this
    },
    html: function () {
      return serializeHtml(root)
    }
  }
}

function serializeHtml (el) {
  if (el.nodeType === 3) return enc(el.textContent)
  const nodeName = el.nodeName.toLowerCase()
  const attributes = el.attributes.map(attr).join('')
  const innerHTML = el.innerHTML || el.childNodes.map(serializeHtml).join('')

  return `<${nodeName}${attributes}>${innerHTML}</${nodeName}>`
}

let attr = a => ` ${a.name}="${enc(a.value)}"`
let enc = s => s.replace(/[&'"<>]/g, a => `&#${a};`)

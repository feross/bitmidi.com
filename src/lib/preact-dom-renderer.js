// TODO: publish to npm

module.exports = createRenderer

const { render } = require('preact')

const hyphenate = require('hyphenate-style-name')
const undom = require('undom')

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
  if (el.nodeType === 3) return encXML(el.textContent)

  const nodeName = el.nodeName.toLowerCase()
  const attributes = el.attributes.map(attr).join('')
  const innerHTML = el.innerHTML || el.childNodes.map(serializeHtml).join('')

  const styleProps = Object.keys(el.style)

  const style = styleProps.length
    ? ` style="${styleProps.map(k => `${hyphenate(k)}: ${el.style[k]}`).join('; ')}"`
    : ''

  return `<${nodeName}${attributes}${style}>${innerHTML}</${nodeName}>`
}

const charMap = {
  '&': '&amp;',
  '\'': '&apos;',
  '"': '&quot;',
  '<': '&lt;',
  '>': '&gt;'
}

function encXML (s) {
  return s.replace(/[&<>]/g, a => charMap[a])
}

function encAttr (s) {
  return s.replace(/[&'"<>]/g, a => charMap[a])
}

function attr (a) {
  return ` ${a.name}="${encAttr(a.value)}"`
}

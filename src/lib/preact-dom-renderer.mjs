// TODO: publish to npm

import { render } from 'preact'

import hyphenate from 'hyphenate-style-name'
import undom from 'undom'

// Patch the global object with a barebones `document`
Object.assign(global, undom().defaultView)

export default function createRenderer () {
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
      if (root == null) throw new Error('render() was not called before html()')
      return serializeHtml(root)
    }
  }
}

// List of elements which must always be self-closing
// See https://www.w3.org/TR/html5/syntax.html#void-elements
const selfClosingTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]

function serializeHtml (el) {
  if (el.nodeType === 3) return encXML(el.textContent)

  const nodeName = el.nodeName.toLowerCase()
  const attributes = el.attributes.map(attr).join('')
  const innerHTML = el.innerHTML || el.childNodes.map(serializeHtml).join('')

  const styleProps = Object.keys(el.style).filter(k => el.style[k] !== '')

  const style = styleProps.length
    ? ` style="${styleProps.map(k => `${hyphenate(k)}: ${encAttr(el.style[k])}`).join('; ')}"`
    : ''

  if (innerHTML === '' && selfClosingTags.includes(nodeName)) {
    return `<${nodeName}${attributes}${style} />`
  } else {
    return `<${nodeName}${attributes}${style}>${innerHTML}</${nodeName}>`
  }
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
  if (typeof s !== 'string') s = s.toString()
  return s.replace(/[&'"<>]/g, a => charMap[a])
}

function attr (a) {
  if (a.value === 'true') return ` ${a.name}` // boolean attribute
  return ` ${a.name}="${encAttr(a.value)}"`
}

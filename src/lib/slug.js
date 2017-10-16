// TODO: publish to npm

module.exports = makeSlug

const mollusc = require('mollusc')

const MOLLUSC_OPTS = {
  limit: 15, // limit slug to this many words
  charmap: Object.assign({ '.': '-' }, mollusc.charmap)
}

const MAX_SLUG_LENGTH = 75

function makeSlug (name) {
  let slug = mollusc(name, MOLLUSC_OPTS)

  // Some unicode symbols have no english equivalent defined
  if (slug.length === 0) slug = 'unicode'

  // Truncate excessively long slugs
  if (slug.length > MAX_SLUG_LENGTH) slug = slug.slice(0, MAX_SLUG_LENGTH)

  return slug
}

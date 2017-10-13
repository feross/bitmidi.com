const test = require('tape')
const slug = require('../src/lib/slug')

test('slug', (t) => {
  // Simple case
  t.equal(
    slug('one two three'),
    'one-two-three'
  )

  // Too many words
  t.equal(
    slug('one two three four five six seven eight nine ten eleven twelve thirteen'),
    'one-two-three-four-five-six-seven-eight-nine-ten-eleven-twelve'
  )

  // Too many characters
  t.equal(
    slug(Array(10).join('supercalifragilisticexpialidocious')),
    'supercalifragilisticexpialidocioussupercalifragilisticexpialidocioussuperca'
  )

  // Unicode emoji
  t.equal(
    slug('so fancy ✨'),
    'so-fancy-sparkles'
  )

  // Unicode Japanese
  t.equal(
    slug('昨夜のコンサートは最高でした。'),
    'unicode'
  )

  // Remove dot character
  t.equal(
    slug('node.js is cool'),
    'node-js-is-cool'
  )

  t.end()
})

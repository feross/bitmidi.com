const test = require('tape')
const slug = require('../src/lib/slug')

test('slug', (t) => {
  // simple case
  t.equal(
    slug('one two three'),
    'one-two-three'
  )

  // too many words
  t.equal(
    slug('one two three four five six seven eight nine ten eleven twelve thirteen'),
    'one-two-three-four-five-six-seven-eight-nine-ten-eleven-twelve'
  )

  // too many characters
  t.equal(
    slug(Array(10).join('supercalifragilisticexpialidocious')),
    'supercalifragilisticexpialidocioussupercalifragilisticexpialidocioussuperca'
  )

  // unicode emoji
  t.equal(
    slug('so fancy ✨'),
    'so-fancy-sparkles'
  )

  // unicode japanese
  t.equal(
    slug('昨夜のコンサートは最高でした。'),
    'unicode'
  )

  // remove dot character
  t.equal(
    slug('node.js is cool'),
    'node-js-is-cool'
  )

  t.end()
})

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
    slug('a b c d e f g h i j k l m n o p'),
    'a-b-c-d-e-f-g-h-i-j-k-l-m-n-o'
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

/*
 * TODO: Rename to .mjs file extension once this issue is fixed:
 * https://github.com/avajs/ava/issues/631#issuecomment-357733734
 */

import slug from '../src/lib/slug'
import test from 'ava'

test('slug', t => {
  // Simple case
  t.is(
    slug('one two three'),
    'one-two-three'
  )

  // Too many words
  t.is(
    slug('a b c d e f g h i j k l m n o p'),
    'a-b-c-d-e-f-g-h-i-j-k-l-m-n-o'
  )

  // Too many characters
  t.is(
    slug(Array(10).join('supercalifragilisticexpialidocious')),
    'supercalifragilisticexpialidocioussupercalifragilisticexpialidocioussuperca'
  )

  // Unicode emoji
  t.is(
    slug('so fancy ✨'),
    'so-fancy-sparkles'
  )

  // Unicode Japanese
  t.is(
    slug('昨夜のコンサートは最高でした。'),
    'unicode'
  )

  // Remove dot character
  t.is(
    slug('node.js is cool'),
    'node-js-is-cool'
  )
})

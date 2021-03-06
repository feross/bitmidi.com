import pMemoize from 'p-memoize'
import QuickLRU from 'quick-lru'

const MEMO_MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days
const MEMO_MAX_SIZE = 50 * 1000

export function memo (fn) {
  return pMemoize(fn, {
    maxAge: MEMO_MAX_AGE,
    cache: new QuickLRU({ maxSize: MEMO_MAX_SIZE }),
    cacheKey: JSON.stringify
  })
}

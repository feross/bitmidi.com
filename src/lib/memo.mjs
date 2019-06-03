import pMemoize from 'p-memoize'
import QuickLRU from 'quick-lru'

export function memo (fn) {
  return pMemoize(fn, {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    cache: new QuickLRU({ maxSize: 5 * 1000 })
  })
}

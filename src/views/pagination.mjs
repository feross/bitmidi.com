import { h } from 'preact' /** @jsx h */
import nodeUrl from 'url' // TODO: remove for Node 10

import Button from './button'

const URL = nodeUrl.URL || window.URL

const Pagination = (props, context) => {
  const { page: pageStr, total } = props
  const page = Number(pageStr)
  const { location } = context.store

  if (page == null || total == null) return null

  const firstPage = Math.max(0, page - 5)
  const lastPage = Math.min(total, firstPage + 10)

  const pageButtons = []
  for (let pageNum = firstPage; pageNum < lastPage; pageNum += 1) {
    pageButtons.push(
      <Button href={getPageUrl(pageNum)}>{pageNum}</Button>
    )
  }

  return (
    <div class='tc mv4'>
      {
        total >= 2 && page !== 0 &&
        <Button href={getPageUrl(page - 1)}>‹ Prev</Button>
      }
      { total >= 2 && pageButtons }
      {
        total >= 2 && page !== total - 1 &&
        <Button href={getPageUrl(page + 1)}>Next ›</Button>
      }
    </div>
  )

  function getPageUrl (page) {
    const url = new URL(location.url, 'http://example.com')
    url.searchParams.set('page', page)
    return url.pathname + url.search
  }
}

export default Pagination

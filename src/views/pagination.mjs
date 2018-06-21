import { h } from 'preact' /** @jsx h */

import Button from './button'

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

  const showPrev = total >= 2 && page !== 0
  const showNext = total >= 2 && page !== total - 1

  return (
    <div class='tc mv4'>
      { showPrev && <Button href={getPageUrl(page - 1)}>‹ Prev</Button> }
      { total >= 2 && pageButtons }
      { showNext && <Button href={getPageUrl(page + 1)}>Next ›</Button> }
    </div>
  )

  function getPageUrl (pageNum) {
    const url = new URL(location.url, 'http://example.com')
    if (pageNum === 0) {
      url.searchParams.delete('page')
    } else {
      url.searchParams.set('page', pageNum)
    }
    return url.pathname + url.search
  }
}

export default Pagination

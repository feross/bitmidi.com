import { h } from 'preact' /** @jsx h */

import Button from './button'

const NUM_PAGES = 5

const Pagination = (props, { store }) => {
  const { page: pageStr, pageTotal, total } = props
  const page = Number(pageStr)
  const { location } = store

  if (page == null || pageTotal == null) return null

  const firstPage = Math.max(0, page - Math.floor(NUM_PAGES / 2))
  const lastPage = Math.min(pageTotal, firstPage + NUM_PAGES)

  const buttons = []

  for (let pageNum = firstPage; pageNum < lastPage; pageNum += 1) {
    buttons.push(
      <Button
        size='medium'
        class='mr1'
        href={getPageUrl(pageNum)}
        fill={pageNum === page}
      >
        {pageNum + 1}
      </Button>
    )
  }

  if (page !== 0) {
    buttons.unshift(
      <Button size='medium' class='mh1' href={getPageUrl(page - 1)}>‹ Prev</Button>
    )
  }
  if (page !== pageTotal - 1) {
    buttons.push(
      <Button size='medium' class='mr1' href={getPageUrl(page + 1)}>Next ›</Button>
    )
  }

  return (
    <div class='tc mv4'>
      <div class='mb3'>{ pageTotal >= 2 && buttons }</div>
      <small class='f6 lh-copy mid-gray'>{total.toLocaleString()} results</small>
    </div>
  )

  function getPageUrl (pageNum) {
    const url = new URL(location.url, 'http://example.com')
    if (pageNum === 0) url.searchParams.delete('page')
    else url.searchParams.set('page', pageNum)
    return url.pathname + url.search
  }
}

export default Pagination

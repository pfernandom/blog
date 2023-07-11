import Link from 'next/link'
import React from 'react'

export default function HomePagination({
  page,
  totalPages,
}: {
  page: number
  totalPages: number
}) {
  const actualPage = page
  const prevLink = page == 2 ? '/' : (actualPage - 1).toString()
  return (
    <div className="home-pagination">
      {page > 1 && (
        <Link
          className="home-pagination__btn btn home-pagination__btn--left"
          href={prevLink}
          data-test-page-link
        >
          ← <span style={{ margin: '2px' }}>See newer posts</span>
        </Link>
      )}

      <div className="home-pagination__btn home-pagination__btn--center">
        Page {actualPage} of {totalPages}
      </div>

      {actualPage < totalPages && (
        <Link
          className="home-pagination__btn btn home-pagination__btn--right"
          href={(actualPage + 1).toString()}
          data-test-page-link
        >
          <span style={{ margin: '2px' }}>See older posts</span> →
        </Link>
      )}
    </div>
  )
}

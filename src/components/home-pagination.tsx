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
      <div>
        {page > 1 && (
          <Link
            className="home-pagination__btn btn"
            href={prevLink}
            data-test-page-link
          >
            &lt; See newer posts
          </Link>
        )}
      </div>
      <div>
        Page {actualPage} of {totalPages}
      </div>
      <div>
        {actualPage < totalPages && (
          <Link
            className="home-pagination__btn btn"
            href={(actualPage + 1).toString()}
            data-test-page-link
          >
            See older posts &gt;
          </Link>
        )}
      </div>
    </div>
  )
}

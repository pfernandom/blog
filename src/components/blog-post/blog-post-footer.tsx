import Link from 'next/link'
import React from 'react'
import { PostInfo } from 'src/models/interfaces'

type BlogPostFooter = {
  prev?: PostInfo | null
  next?: PostInfo | null
}

export default function BlogPostFooter({ prev, next }: BlogPostFooter) {
  return (
    <ul className="home-pagination">
      {prev && (
        <li className="home-pagination__btn btn home-pagination__btn--left">
          <Link href={`/${prev.slug}`}>
            <span> ← {prev.frontmatter.title} </span>
          </Link>
        </li>
      )}
      <span className="home-pagination__btn home-pagination__btn--center"></span>
      {next && (
        <li className="home-pagination__btn btn home-pagination__btn--right">
          <Link href={`/${next.slug}`}>
            <span>{next.frontmatter.title} →</span>
          </Link>
        </li>
      )}
    </ul>
  )
}

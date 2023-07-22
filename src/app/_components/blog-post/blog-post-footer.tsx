import { Post } from 'app/models/interfaces'
import Link from 'next/link'

type BlogPostFooter = {
  prev?: Post | null
  next?: Post | null
}

export default function BlogPostFooter({ prev, next }: BlogPostFooter) {
  return (
    <ul className="home-pagination">
      {prev && (
        <li className="home-pagination__btn btn home-pagination__btn--left">
          <Link href={`/${prev.slug}`}>
            <span> ← {prev.title} </span>
          </Link>
        </li>
      )}
      <span className="home-pagination__btn home-pagination__btn--center"></span>
      {next && (
        <li className="home-pagination__btn btn home-pagination__btn--right">
          <Link href={`/${next.slug}`}>
            <span>{next.title} →</span>
          </Link>
        </li>
      )}
    </ul>
  )
}

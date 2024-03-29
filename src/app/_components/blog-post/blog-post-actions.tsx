'use client'

import urlGetterFactory from 'app/helpers/url-getter-factory'
import { Post } from 'app/models/interfaces'
import ShareButtons from '../share-buttons'

export default function BlogPostActions({
  slug,
  date,
  title,
  description,
  host,
}: Post & { host: string }) {
  const getPageUrl = urlGetterFactory(host)

  if (!slug) {
    return <></>
  }

  return (
    <div className="blog-post-actions">
      <div className="blog-post-date">
        &#x1F4C6; <span className="blog-post-date-text">{date}</span>
      </div>

      <ShareButtons
        title={title}
        url={getPageUrl(slug)}
        author="Pedro Marquez"
        description={
          typeof description === 'string' ? description : description.join('. ')
        }
      ></ShareButtons>
    </div>
  )
}

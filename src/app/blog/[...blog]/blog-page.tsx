import BlogPostActions from 'app/_components/blog-post/blog-post-actions'
import BlogPostFooter from 'app/_components/blog-post/blog-post-footer'
import { BlogPostSeries } from 'app/_components/blog-post/blog-post-series'
import mapSeriesSlutToTitle from 'app/helpers/blog-series-slug'
import { Post } from 'app/models/interfaces'
import { FirebaseOptions } from 'firebase/app'
import Link from 'next/link'
import PageComments from './page-comments'

export interface BlogParams {
  title: string
  post: Post
  host: string
  prev: Post | null | undefined
  next: Post | null | undefined
  isPartOfSeries?: false
  children: JSX.Element
  seriesSlug?: never
  seriesPosts?: never
}

export interface SeriesBlogParams
  extends Omit<BlogParams, 'isPartOfSeries' | 'seriesSlug' | 'seriesPosts'> {
  isPartOfSeries: boolean
  seriesSlug: string
  seriesPosts: Post[]
  children: JSX.Element
}

export function BlogPageComponent({
  title,
  isPartOfSeries,
  seriesSlug,
  post,
  host,
  seriesPosts,
  prev,
  next,
  children,
}: BlogParams | SeriesBlogParams) {
  const {
    F_API_KEY,
    F_AUTH_DOMAIN,
    F_PROJECT_ID,
    F_STORAGE_BUCKET,
    F_MESSAGING_SENDER_ID,
    F_APP_ID,
    F_MEASUREMENT_ID,
  } = process.env

  const firebaseConfig: FirebaseOptions = {
    apiKey: F_API_KEY,
    authDomain: F_AUTH_DOMAIN,
    projectId: F_PROJECT_ID,
    storageBucket: F_STORAGE_BUCKET,
    messagingSenderId: F_MESSAGING_SENDER_ID,
    appId: F_APP_ID,
    measurementId: F_MEASUREMENT_ID,
  }
  return (
    <>
      <header>
        <div style={{ marginBottom: '1em' }}>
          <Link href="/"> &larr; Back to all posts</Link>
        </div>
        <h1>{title}</h1>
      </header>
      <div>
        {isPartOfSeries && (
          <h2 className="blog-series-subtitle">
            From the series:{' '}
            <Link
              href={'/series/' + seriesSlug}
              style={{ textDecoration: 'underline' }}
            >
              {mapSeriesSlutToTitle(seriesSlug)}
            </Link>
          </h2>
        )}

        <BlogPostActions host={host} {...post} />

        {isPartOfSeries && (
          <BlogPostSeries post={post} seriesPosts={seriesPosts} />
        )}

        {/* <DynamicSlot post={post} /> */}
        {children}

        <PageComments slug={post.slug} firebaseConfig={firebaseConfig} />

        <BlogPostFooter prev={prev} next={next} />
      </div>
    </>
  )
}

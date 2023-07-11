import BlogPostActions from 'app/_components/blog-post/blog-post-actions'
import DynamicSlot from 'app/_components/blog-post/blog-post-dynamic-slot'
import BlogPostFooter from 'app/_components/blog-post/blog-post-footer'
import {
  BlogPostSeries,
  getNextAndPrevSeries,
} from 'app/_components/blog-post/blog-post-series'
import mapSeriesSlutToTitle from 'app/helpers/blog-series-slug'
import { getAllPosts } from 'app/helpers/page-fetcher'
import urlGetterFactory from 'app/helpers/url-getter-factory'
import { FirebaseOptions } from 'firebase/app'
import { Metadata } from 'next'
import Link from 'next/link'
import { PostInfo } from '../../models/interfaces'
import { getBlogPostSEO } from './metadata'
import PageComments from './page-comments'

type Props = {
  params: { blog: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}

function getNextAndPrev(posts: Array<PostInfo>, currentPost: PostInfo) {
  const filtered = posts.filter((p) => p.frontmatter.published)

  const postIndex = filtered.findIndex((p) => p.slug === currentPost?.slug)
  const prevIndex = postIndex - 1

  const nextIndex = postIndex + 1

  const prev = prevIndex >= 0 ? filtered[prevIndex] : null
  const next = nextIndex < filtered.length ? filtered[nextIndex] : null

  return { prev, next }
}

function getPageData(slug: string) {
  const host = process.env['SITE_URL'] ?? ''
  const allPosts = getAllPosts()

  const posts: Array<PostInfo> = allPosts.map((post) => {
    post.content = ''
    return post
  })

  // TODO: Handle default case
  const post =
    posts.find((post: PostInfo) => {
      return post.slug.endsWith(slug)
    }) ?? posts[0]

  const seriesPosts = posts.filter(
    (post) =>
      post.frontmatter.series &&
      post.frontmatter.series === post?.frontmatter.series
  )

  const getPageUrl = urlGetterFactory(host)
  const prevAndNext = getNextAndPrev(posts, post)
  const { prevInSeries, nextInSeries } = getNextAndPrevSeries(post, seriesPosts)
  const { prev, next } = prevAndNext

  const { frontmatter } = post
  const seoImages = [
    frontmatter.hero_image_original ?? null,
    frontmatter.hero_image,
  ]
    .filter((img) => img != null)
    .map((img) => getPageUrl(img as string, true))

  const isPartOfSeries = seriesPosts.length > 1

  const prevS =
    prevInSeries.length > 0
      ? getPageUrl(prevInSeries[prevInSeries.length - 1].slug)
      : null
  const nextS =
    nextInSeries.length > 0 ? getPageUrl(nextInSeries[0].slug) : null

  return {
    post,
    isPartOfSeries,
    host,
    seriesPosts,
    prev,
    next,
    seoImages,
    pageLinks: { next: nextS, prev: prevS },
  }
}

// or Dynamic metadata
export async function generateMetadata({
  params,
  searchParams,
}: Props): // parent: ResolvingMetadata
Promise<Metadata> {
  console.log({ params, searchParams })
  const { post, seoImages, pageLinks } = getPageData(params['blog'].join('/'))
  return getBlogPostSEO(post, seoImages, pageLinks)
}

export default async function BlogPage({
  params,
}: {
  params: { blog: string[] }
}) {
  const { post, isPartOfSeries, host, seriesPosts, prev, next } = getPageData(
    params['blog'].join('/')
  )

  // const content = post != null ? await m(post?.postPath) : {}
  // const MDXContent = content.default
  const content = '<div></div>'

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
        <h1>{post.frontmatter.title}</h1>
      </header>
      <div>
        {isPartOfSeries && (
          <h2 className="blog-series-subtitle">
            From the series:{' '}
            <Link
              href={'/series/' + post.frontmatter.series}
              style={{ textDecoration: 'underline' }}
            >
              {mapSeriesSlutToTitle(post.frontmatter.series as string)}
            </Link>
          </h2>
        )}

        <BlogPostActions host={host} {...post} />

        <BlogPostSeries post={post} seriesPosts={seriesPosts} />

        <DynamicSlot ssrContent={content} post={post} />

        <PageComments slug={post.slug} firebaseConfig={firebaseConfig} />

        <BlogPostFooter prev={prev} next={next} />
      </div>
    </>
  )
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  const paths = posts.map((post) => {
    return {
      params: {
        blog: [...post.slug.split('/').slice(1)],
      },
    }
  })

  return paths
}

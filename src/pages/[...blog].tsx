/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextPage } from 'next'
import BlogPostActions from 'src/components/blog-post/blog-post-actions'
import DynamicSlot from 'src/components/blog-post/blog-post-dynamic-slot'
import BlogPostFooter from 'src/components/blog-post/blog-post-footer'
// @ts-ignore
// @ts-nocheck
import BlogPostSEO from 'src/components/blog-post/blog-post-seo'
import { getAllPosts } from 'src/helpers/page-fetcher'
import urlGetterFactory from 'src/helpers/url-getter-factory'
import { Metadata, PostInfo } from '../models/interfaces'
import { renderToStaticMarkup } from 'react-dom/server'
import m from 'src/imports'
import {
  BlogPostSeries,
  getNextAndPrevSeries,
} from 'src/components/blog-post/blog-post-series'
import mapSeriesSlutToTitle from 'src/helpers/blog-series-slug'
import Link from 'next/link'

export function getNextAndPrev(posts: Array<PostInfo>, currentPost: PostInfo) {
  const filtered = posts.filter((p) => p.frontmatter.published)

  const postIndex = filtered.findIndex((p) => p.slug === currentPost?.slug)
  const prevIndex = postIndex - 1

  const nextIndex = postIndex + 1

  const prev = prevIndex >= 0 ? filtered[prevIndex] : null
  const next = nextIndex < filtered.length ? filtered[nextIndex] : null

  return { prev, next }
}

export type BlogPlaceholderParams = {
  metadata: Metadata
  blog: Array<string>
  post: PostInfo
  posts: PostInfo[]
  seriesPosts: PostInfo[]
  host: string
  content: string
  isProd: boolean
}

const BlogPlaceholder: NextPage<BlogPlaceholderParams> = ({
  post,
  posts,
  seriesPosts,
  host,
  content,
}) => {
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

  const prevS =
    prevInSeries.length > 0
      ? getPageUrl(prevInSeries[prevInSeries.length - 1].slug)
      : null
  const nextS =
    nextInSeries.length > 0 ? getPageUrl(nextInSeries[0].slug) : null

  const isPartOfSeries = seriesPosts.length > 1

  return (
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
      <BlogPostSEO
        url={getPageUrl(post.slug)}
        images={seoImages}
        author={'Pedro Marquez-Soto'}
        seriesPosts={[prevS, nextS]}
        {...post.frontmatter}
      ></BlogPostSEO>

      <BlogPostActions host={host} {...post} />

      <BlogPostSeries post={post} seriesPosts={seriesPosts} />

      <DynamicSlot ssrContent={content} post={post} />

      <BlogPostFooter prev={prev} next={next} />
    </div>
  )
}

export default BlogPlaceholder

export async function getStaticProps({
  params,
}: {
  params: BlogPlaceholderParams
}) {
  const allPosts = getAllPosts();

  const posts: Array<PostInfo> = allPosts.map((post) => {
    post.content = ''
    return post
  })

  const selectedPost = posts.find((post: PostInfo) => {
    return post.slug.includes(params.blog?.join('/'))
  })

  const seriesPosts = posts.filter(
    (post) =>
      post.frontmatter.series &&
      post.frontmatter.series === selectedPost?.frontmatter.series
  )

  const content = selectedPost != null ? await m(selectedPost?.postPath) : {}
  const MDXContent = content.default

  const host = process.env['SITE_URL']
  return {
    props: {
      metadata: selectedPost?.frontmatter ?? {},
      blog: params.blog ?? [],
      seriesPosts: seriesPosts ?? [],
      post: selectedPost ?? {},
      posts: posts ?? [],
      host,
      content: renderToStaticMarkup(<MDXContent />),
      isProd: process.env.NODE_ENV === 'production',
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts()

  return {
    paths: posts.map((post) => {
      return {
        params: {
          blog: ['blog', ...post.slug.split('/').slice(1)],
        },
      }
    }),
    fallback: false,
  }
}


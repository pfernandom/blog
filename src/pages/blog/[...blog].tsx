/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FirebaseApp } from 'firebase/app'
import { Firestore } from 'firebase/firestore'
import { NextPage } from 'next'
import BlogPostComments from 'src/components/blog-post/blog-comments/blog-post-comments'
import BlogPostActions from 'src/components/blog-post/blog-post-actions'
import DynamicSlot from 'src/components/blog-post/blog-post-dynamic-slot'
import BlogPostFooter from 'src/components/blog-post/blog-post-footer'

// @ts-ignore
// @ts-nocheck
import { FirebaseOptions } from 'firebase/app'
import Link from 'next/link'
import React, { useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import BlogPostSEO from 'src/components/blog-post/blog-post-seo'
import {
  BlogPostSeries,
  getNextAndPrevSeries,
} from 'src/components/blog-post/blog-post-series'
import { getFirebase } from 'src/firebase'
import mapSeriesSlutToTitle from 'src/helpers/blog-series-slug'
import { getAllPosts } from 'src/helpers/page-fetcher'
import urlGetterFactory from 'src/helpers/url-getter-factory'
import m from 'src/imports'
import { Metadata, PostInfo } from '../../models/interfaces'
import AuthContextProvider from 'src/components/auth/auth-context-provider'
import ErrorBoundary from 'src/components/error-boundary'

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
  firebaseConfig: FirebaseOptions
}

export const FirebaseContext = React.createContext<{
  app?: FirebaseApp
  db?: Firestore
}>({})

const BlogPlaceholder: NextPage<BlogPlaceholderParams> = ({
  post,
  posts,
  seriesPosts,
  host,
  content,
  firebaseConfig,
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

  const [firebase] = useState(getFirebase(firebaseConfig))

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

      <ErrorBoundary fallbackComponent={<></>}>
        <FirebaseContext.Provider value={firebase}>
          <AuthContextProvider>
            <BlogPostComments slug={post.slug} />
          </AuthContextProvider>
        </FirebaseContext.Provider>
      </ErrorBoundary>

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
  const allPosts = getAllPosts()

  const posts: Array<PostInfo> = allPosts.map((post) => {
    post.content = ''
    return post
  })

  const selectedPost = posts.find((post: PostInfo) => {
    return post.slug.endsWith(params.blog?.join('/'))
  })

  const seriesPosts = posts.filter(
    (post) =>
      post.frontmatter.series &&
      post.frontmatter.series === selectedPost?.frontmatter.series
  )

  const content = selectedPost != null ? await m(selectedPost?.postPath) : {}
  const MDXContent = content.default

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
      firebaseConfig: firebaseConfig ?? {},
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts()
  const paths = posts.map((post) => {
    return {
      params: {
        blog: [...post.slug.split('/').slice(1)],
      },
    }
  })

  return {
    paths,
    fallback: false,
  }
}

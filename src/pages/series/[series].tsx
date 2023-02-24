import type { NextPage } from 'next'
import Head from 'next/head'

import React from 'react'

import { useRouter } from 'next/router'
import { Metadata, PostInfo } from 'src/models/interfaces'
import { getDataFile } from 'src/helpers/data-fetchers'
import { getAllPosts } from 'src/helpers/page-fetcher'
import mapSeriesSlutToTitle from 'src/helpers/blog-series-slug'
import PostsList from 'src/components/home/posts-list'

type HomeParams = {
  metadata: Metadata
  posts: Array<PostInfo>
}

const Home: NextPage<HomeParams> = ({ metadata, posts }) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PostsList posts={posts.filter((post) => post.frontmatter.published)} />
    </>
  )
}

export default Home

export async function getStaticProps({
  params,
}: {
  params: { series: string }
}) {
  const metadata: Metadata = await getDataFile('src/data/metadata.json')

  const posts: Array<PostInfo> = getAllPosts().filter(
    (post) => post.frontmatter.series === params.series
  )

  return {
    props: {
      posts,
      metadata: {
        ...metadata,
        title: `Blogs Series: ${mapSeriesSlutToTitle(params.series)}`,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts()

  const postsWithSeries = new Set(
    posts
      .filter((post) => post.frontmatter.series)
      .map((post) => post.frontmatter.series)
  )

  return {
    paths: Array.from(postsWithSeries).map((series) => {
      return {
        params: {
          series,
        },
      }
    }),
    fallback: false,
  }
}

import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'src/components/image'

import React from 'react'
import Link from 'next/link'

import Bio from '../../components/bio'
import { getDataFile } from '../../helpers/data-fetchers'
import { getAllPosts } from '../../helpers/page-fetcher'
import { Metadata, PostInfo } from '../../models/interfaces'
import { useRouter } from 'next/router'
import HomePagination from 'src/components/home-pagination'
import PostsList from 'src/components/home/posts-list'

type HomeParams = {
  metadata: Metadata
  posts: Array<PostInfo>
  tag: string
}

export const POSTS_PER_PAGE = 5

export function getTotalPages(postsCount: number) {
  return (
    Math.floor(postsCount / POSTS_PER_PAGE) +
    (postsCount % POSTS_PER_PAGE > 0 ? 1 : 0)
  )
}

const TagHomePage: NextPage<HomeParams> = ({ metadata, posts, tag }) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Bio metadata={metadata} />
      <h2 style={{ marginTop: 0 }}>Tag: {tag}</h2>

      <PostsList posts={posts} />
      {/* <HomePagination page={page} totalPages={totalPages} /> */}
    </>
  )
}

export default TagHomePage

export async function getStaticProps({ params }: { params: { tag: string } }) {
  const { tag } = params

  const allPosts = getAllPosts().filter((post) =>
    post.frontmatter.key_words.includes(tag)
  )

  const metadata: Metadata = await getDataFile('src/data/metadata.json')

  const posts: Array<PostInfo> = allPosts.map((post) => {
    post.content = ''
    return post
  })

  return {
    props: {
      posts,
      metadata,
      tag,
    },
  }
}

export async function getStaticPaths() {
  const tags = new Set(
    getAllPosts()
      .flatMap((post) => post.frontmatter.key_words)
      .map((el) => el.trim())
  )

  const paths = new Array(...tags).map((tag) => ({
    params: {
      tag,
    },
  }))

  return { paths, fallback: false }
}

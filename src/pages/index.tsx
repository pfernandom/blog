import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'src/components/image'

import React from 'react'
import Link from 'next/link'

import Bio from '../components/bio'
import { getDataFile } from '../helpers/data-fetchers'
import { getAllPosts } from '../helpers/page-fetcher'
import { Metadata, PostInfo } from '../models/interfaces'
import { useRouter } from 'next/router'
import HomePagination from 'src/components/home-pagination'
import { getTotalPages, POSTS_PER_PAGE } from './[page]'
import PostsList from 'src/components/home/posts-list'

type HomeParams = {
  metadata: Metadata
  posts: Array<PostInfo>
  totalPages: number
}

const Home: NextPage<HomeParams> = ({ metadata, posts, totalPages }) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Bio metadata={metadata} />
      <PostsList posts={posts} />

      <HomePagination page={1} totalPages={totalPages} />
    </>
  )
}

export default Home

export async function getStaticProps() {
  const metadata: Metadata = await getDataFile('src/data/metadata.json')

  const allPosts = getAllPosts()
  const postsCount = getAllPosts().length
  const totalPages = getTotalPages(postsCount)

  const posts: Array<PostInfo> = allPosts
    .slice(0, POSTS_PER_PAGE)
    .map((post) => {
      post.content = ''
      return post
    })

  return {
    props: {
      posts,
      metadata,
      totalPages,
    },
  }
}

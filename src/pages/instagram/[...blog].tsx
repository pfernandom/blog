import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'

import { InstagramPost } from 'src/models/InstagramPost'
import { getAllPosts } from 'src/helpers/page-fetcher'
import { InstagramLinkParams, PostInfo } from 'src/models/interfaces'
import { InstagramDataService } from '../api/instagram-post'
import dynamic, { LoadableComponent } from 'next/dynamic'
import m from 'src/imports'

const InstagramLink: NextPage<InstagramLinkParams> = ({
  metadata,
  posts,
  post,
  instagramPostConfig,
  isProd,
}) => {
  if (isProd) {
    return <div></div>
  }
  if (!post || !post.frontmatter) {
    return <div>No post selected</div>
  }

  const InstagramEditTools = dynamic(
    () => import('src/components/instagram-post/edit-tools'),
    {
      ssr: false,
      loading: (loadingProps) => {
        return <div>Loading</div>
        // return <GhostContent />
      },
    }
  )

  return (
    <div>
      <Link href="/instagram">Go to all Instagram posts</Link>
      <InstagramEditTools post={post} defaultConfig={instagramPostConfig} />
    </div>
  )
}

export default InstagramLink

export async function getStaticProps({
  params,
}: {
  params: InstagramLinkParams
}) {
  const posts: Array<PostInfo> = getAllPosts()

  const selectedPost = posts.find((post: PostInfo) => {
    return post.slug.includes(params.blog?.join('/'))
  })

  const instagramService = new InstagramDataService()
  const instagramPostConfig: InstagramPost = instagramService.get(
    selectedPost?.slug ?? ''
  )

  const host = process.env['SITE_URL']
  return {
    props: {
      notFound: process.env.NODE_ENV === 'production',
      metadata: selectedPost?.frontmatter ?? {},
      blog: params.blog ?? [],
      post: selectedPost ?? {},
      posts: posts ?? [],
      host,
      instagramPostConfig,
      isProd: process.env.NODE_ENV === 'production',
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts()

  const isProd = process.env.NODE_ENV === 'production'

  if (isProd) {
    return {
      paths: [],
      fallback: false,
    }
  }

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

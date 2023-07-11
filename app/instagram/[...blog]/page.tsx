import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'

import { InstagramPost } from 'app/models/InstagramPost'
import { getAllPosts } from 'app/helpers/page-fetcher'
import { InstagramLinkParams, PostInfo } from 'app/models/interfaces'
import { InstagramDataService } from 'app/api/instagram-post'
import dynamic from 'next/dynamic'

export default function InstagramLink({
  params,
}: {
  params: { blog: string[] }
}) {
  const posts: Array<PostInfo> = getAllPosts()

  const selectedPost = posts.find((post: PostInfo) => {
    return post.slug.includes(params.blog?.join('/'))
  })

  const instagramService = new InstagramDataService()
  const instagramPostConfig: InstagramPost = instagramService.get(
    selectedPost?.slug ?? ''
  )

  const isProd = process.env.NODE_ENV === 'production'
  const post = selectedPost

  if (isProd) {
    return <div></div>
  }
  if (!post || !post.frontmatter) {
    return <div>No post selected</div>
  }

  const InstagramEditTools = dynamic(
    () => import('app/_components/instagram-post/edit-tools'),
    {
      ssr: false,
      loading: () => {
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

export async function generateStaticParams(): Promise<any[]> {
  const posts = getAllPosts()

  const isProd = process.env.NODE_ENV === 'production'

  if (isProd) {
    return []
  }

  return posts.map((post) => {
    return {
      params: {
        blog: ['blog', ...post.slug.split('/').slice(1)],
      },
    }
  })
}

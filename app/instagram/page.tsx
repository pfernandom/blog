import React from 'react'
import Link from 'next/link'
import InstagramPostView from 'app/_components/instagram-post/instagram-post-view'
import { InstagramPost } from 'app/models/InstagramPost'
import { getDataFile } from 'app/helpers/data-fetchers'
import { getAllPosts } from 'app/helpers/page-fetcher'
import { Metadata, PostInfo } from 'app/models/interfaces'
import { InstagramDataService } from '../api/instagram-post'

export type InstagramLinksParams = {
  metadata: Metadata
  blog: Array<string>
  post: PostInfo
  posts: PostInfo[]
  host: string
  isProd: boolean
  postToConfig: Record<string, InstagramPost>
}

export default async function InstagramLinks() {
  const posts: Array<PostInfo> = getAllPosts()
  const isProd = process.env.NODE_ENV === 'production'

  const instagramService = new InstagramDataService()

  // posts.forEach((post) => {
  //   instagramService.save({
  //     slug: post.slug,
  //     instagramPost: InstagramDefaultConfig,
  //   });
  // });

  const allInstagramConfigs = posts.map((post) =>
    instagramService.get(post.slug)
  )

  const postToConfig = allInstagramConfigs.reduce(
    (acc, config) => ({ [config.slug ?? '']: config, ...acc }),
    {}
  )
  return (
    <div className="instagram-posts">
      {posts.map((post) => (
        <div key={post.slug} className="instagram-post-tile">
          <Link href={post.slug}>
            <InstagramPostView
              pageNumber={1}
              post={post}
              currentConfig={new InstagramPost(postToConfig[post.slug])}
            />
          </Link>
          {!isProd && <Link href={`/instagram/${post.slug}`}>Edit</Link>}
        </div>
      ))}
    </div>
  )
}

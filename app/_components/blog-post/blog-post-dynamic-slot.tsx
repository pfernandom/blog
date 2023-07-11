'use client'

import dynamic, { LoadableComponent } from 'next/dynamic'
import React from 'react'
import m from 'app/imports'
import { PostInfo } from 'app/models/interfaces'
import BlogPostProvider from './blog-post-provider'

export default function DynamicSlot({
  post,
  ssrContent,
  onLoad,
}: {
  post: PostInfo
  ssrContent: string
  onLoad?: () => void
}) {
  const DynamicBlogPost: LoadableComponent = dynamic(() => m(post.postPath), {
    ssr: false,
    loading: (loadingProps) => {
      if (!loadingProps.isLoading) {
        onLoad?.call(loadingProps)
      }
      return (
        <div
          data-test-blog-content
          dangerouslySetInnerHTML={{ __html: ssrContent }}
        ></div>
      )
    },
  })

  return (
    <div className="blog-post-content" data-test-blog-content>
      {/* <GhostContent /> */}
      <BlogPostProvider>
        <DynamicBlogPost />
      </BlogPostProvider>
    </div>
  )
}

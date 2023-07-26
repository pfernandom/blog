'use client'

import dynamic, { LoadableComponent } from 'next/dynamic'
import React from 'react'
import m from 'app/imports'

export default function DynamicSlot({
  postPath,
  ssr,
  onLoad,
}: {
  postPath: string
  ssr: string
  onLoad?: () => void
}) {
  const DynamicBlogPost: LoadableComponent = dynamic(
    () => m(postPath?.replace('/index.mdx', '')?.replace('src/app/', '')),
    {
      ssr: true,
      loading: (loadingProps) => {
        if (!loadingProps.isLoading) {
          onLoad?.call(loadingProps)
        }
        return <div data-test-blog-content>Loading</div>
      },
    }
  )

  return (
    <div className="blog-post-content" data-test-blog-content>
      <DynamicBlogPost />
    </div>
  )
}

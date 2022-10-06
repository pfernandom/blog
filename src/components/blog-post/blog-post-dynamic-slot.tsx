import dynamic, {
  LoadableComponent
} from 'next/dynamic'
import React from 'react'
import m from 'src/imports'
import { PostInfo } from 'src/models/interfaces'

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
      return <div data-test-blog-content dangerouslySetInnerHTML={{ __html: ssrContent }}></div>
    },
  })

  return (
    <div className="blog-post-content" data-test-blog-content>
      {/* <GhostContent /> */}
      <DynamicBlogPost />
    </div>
  )
}

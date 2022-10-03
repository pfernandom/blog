import dynamic, {
  DynamicOptionsLoadingProps,
  LoadableComponent,
  Loader,
} from 'next/dynamic'
import React, { useMemo } from 'react'
import m from 'src/imports'
import { PostInfo } from 'src/models/interfaces'

function GhostContent() {
  return (
    <div>
      <div>
        {Array.from(Array(1).keys()).map((ps) => (
          <p key={ps}>
            {Array.from(Array(3).keys()).map((val) => (
              <span className="loading-state" key={val}></span>
            ))}
          </p>
        ))}
      </div>
      {Array.from(Array(2).keys()).map((elements) => (
        <div key={elements}>
          <div className="loading-state loading-state--heading"></div>
          <div>
            {Array.from(Array(3).keys()).map((ps) => (
              <p key={ps}>
                {Array.from(Array(3).keys()).map((val) => (
                  <span className="loading-state" key={val}></span>
                ))}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

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

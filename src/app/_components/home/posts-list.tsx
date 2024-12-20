import { ImageWithFallback } from 'app/_components/image'
import { PostInfo } from 'app/models/interfaces'
import Link from 'next/link'
import { ReactElement } from 'react'

function NavigationPane({
  slug,
  children,
  isPublished,
}: {
  slug: string
  isPublished: boolean
  children: ReactElement | ReactElement[]
}): ReactElement {
  if (!isPublished) {
    return (
      <div className="link-post-container--unpublished">
        <div className="link-post-container--unpublished-mark">Unpublished</div>
        <div className="link-post-container link-post-a" data-key={slug}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="link-post-container link-post-a" data-key={slug}>
      {children}
    </div>
  )
}

export default function PostsList({ posts }: { posts: Array<PostInfo> }) {
  const isDev = process.env.NODE_ENV === 'development'
  console.log({ isDev, posts })
  return (
    <>
      {posts
        .filter((post) => isDev || post.frontmatter?.published)
        .map((post) => {
          const image = post.frontmatter.hero_image
          const linkHref = `/${post.slug}`
          const { description, key_words } = post.frontmatter
          const keywordList = key_words
            ? typeof key_words === 'string'
              ? key_words.split(',')
              : key_words
            : []

          return (
            <NavigationPane
              slug={post.slug}
              key={post.slug}
              isPublished={!!post.frontmatter.published}
            >
              <Link
                className="post-list-image-link"
                href={linkHref}
                data-test-page-link
              >
                <div style={{ height: '100%' }}>
                  <div
                    style={{ width: 100, height: 100 }}
                    className="circle-image-container"
                  >
                    {post.frontmatter.hero_image && image ? (
                      <ImageWithFallback
                        src={image}
                        fallbackSrc="/post_fallback.jpg"
                        className="circle-image"
                        alt={post.frontmatter.hero_image_alt}
                        placeholder="blur"
                        blurDataURL={post.frontmatter.hero_image_blur}
                        width={100}
                        height={100}
                        objectFit="cover"
                      />
                    ) : (
                      <div className="circle-image-empty"></div>
                    )}
                  </div>
                </div>
              </Link>
              <Link
                className="link-content"
                href={linkHref}
                data-test-page-link
              >
                <h3 className="link-post">{post.frontmatter.title}</h3>
                <small>{post.frontmatter.date}</small>
                {typeof description === 'string' ? (
                  <p dangerouslySetInnerHTML={{ __html: description }} />
                ) : (
                  description.map((description) => (
                    <p
                      key={description}
                      dangerouslySetInnerHTML={{
                        __html: description,
                      }}
                    />
                  ))
                )}
              </Link>
              <div className="link-post-tag-list">
                {keywordList.slice(0, 5).map((keyword) => (
                  <Link
                    key={keyword}
                    href={`/tags/${keyword}`}
                    className="link-post-keyword btn"
                  >
                    {keyword}
                  </Link>
                ))}
              </div>
            </NavigationPane>
          )
        })}
    </>
  )
}

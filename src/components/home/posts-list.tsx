import Link from 'next/link'
import router from 'next/router'
import React from 'react'
import Image from 'src/components/image'
import { PostInfo } from 'src/models/interfaces'

export default function PostsList({ posts }: { posts: Array<PostInfo> }) {
  return (
    <>
      {posts
        .filter((post) => post.frontmatter?.published)
        .map((post) => {
          const image = post.frontmatter.hero_image
          const linkHref = `/${post.slug}`

          return (
            <div
              key={post.slug}
              className="link-post-container link-post-a"
              data-key={post.slug}
              onMouseEnter={() => {
                router.prefetch(post.slug)
              }}
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
                    {post.frontmatter.hero_image ? (
                      <Image
                        src={image}
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
                {post.frontmatter.description.map((description) => (
                  <p
                    key={description}
                    dangerouslySetInnerHTML={{
                      __html: description,
                    }}
                  />
                ))}
              </Link>
              <div className="link-post-tag-list">
                {post.frontmatter.key_words.slice(0, 5).map((keyword) => (
                  <Link
                    key={keyword}
                    href={`/tags/${keyword}`}
                    className="link-post-keyword btn"
                  >
                    {keyword}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
    </>
  )
}

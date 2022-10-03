import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'src/components/image'

import React from 'react'
import Link from 'next/link'

import { useRouter } from 'next/router'
import generateRssFeed from 'src/helpers/generate-rss-feed'
import { Metadata, PostInfo } from 'src/models/interfaces'
import { getDataFile } from 'src/helpers/data-fetchers'
import { getAllPosts } from 'src/helpers/page-fetcher'
import mapSeriesSlutToTitle from 'src/helpers/blog-series-slug'

type HomeParams = {
  metadata: Metadata
  posts: Array<PostInfo>
}

const Home: NextPage<HomeParams> = ({ metadata, posts }) => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {posts
        .filter((post) => post.frontmatter.published)
        .map((post) => {
          const image = post.frontmatter.hero_image

          return (
            <Link
              key={post.slug}
              style={{ display: `contents` }}
              href={`/${post.slug}`}
              data-test-page-link
            >
              <div
                className="link-post-container link-post-a"
                data-key={post.slug}
                onMouseEnter={() => {
                  router.prefetch(post.slug)
                }}
              >
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

                <div className="link-content">
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

                  {post.frontmatter.key_words.map((keyword) => (
                    <div key={keyword} className="link-post-keywords">
                      {keyword}
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          )
        })}
    </>
  )
}

export default Home

export async function getStaticProps({
  params,
}: {
  params: { series: string }
}) {
  await generateRssFeed()
  const metadata: Metadata = await getDataFile('src/data/metadata.json')

  const posts: Array<PostInfo> = getAllPosts().filter(
    (post) => post.frontmatter.series === params.series
  )

  return {
    props: {
      posts,
      metadata: {
        ...metadata,
        title: `Blogs Series: ${mapSeriesSlutToTitle(params.series)}`,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts()

  const postsWithSeries = new Set(
    posts
      .filter((post) => post.frontmatter.series)
      .map((post) => post.frontmatter.series)
  )

  return {
    paths: Array.from(postsWithSeries).map((series) => {
      return {
        params: {
          series,
        },
      }
    }),
    fallback: false,
  }
}

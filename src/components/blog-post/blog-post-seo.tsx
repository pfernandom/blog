import { ArticleJsonLd, NextSeo } from 'next-seo'
import { HTML5MetaTag } from 'next-seo/lib/types'
import Head from 'next/head'
import Script from 'next/script'
import React from 'react'
import { Post, PostInfo } from 'src/models/interfaces'
import { getNextAndPrevSeries } from './blog-post-series'

export type BlogPostSEOProps = Post & {
  url: string
  images: Array<string>
  author: string
  seriesPosts: [string | null, string | null]
}

const BLOG_POST_IMG_WIDTH = 440
const BLOG_POST_IMG_HEIGHT = 220

export default function BlogPostSEO({
  url,
  title,
  description,
  date,
  images,
  author,
  key_words,
  seriesPosts,
  hero_image_alt,
}: BlogPostSEOProps) {
  const imageList = images.map((image) => ({
    url: image,
    width: BLOG_POST_IMG_WIDTH,
    height: BLOG_POST_IMG_HEIGHT,
    alt: hero_image_alt,
  }))

  const [prevSeries, nextSeries] = seriesPosts

  const PrevLink = () =>
    prevSeries ? (
      <link rel="prev" href={prevSeries} />
    ) : (
      <link rel="prev" href="noop" />
    )
  const NextLink = () =>
    nextSeries ? (
      <link rel="next" href={nextSeries} />
    ) : (
      <link rel="prev" href="noop" />
    )

  return (
    <>
      <ArticleJsonLd
        type="Blog"
        url={url}
        title={title}
        images={images}
        datePublished={date}
        dateModified={date}
        authorName={author}
        description={description.join('. ')}
      />

      <NextSeo
        canonical={url}
        openGraph={{
          title,
          description: description.join('. '),
          url,
          type: 'article',
          article: {
            publishedTime: date,
            modifiedTime: date,
            section: 'Section II',
            authors: [author],
            tags: key_words,
          },
          images: imageList,
        }}
        additionalLinkTags={[
          { rel: 'prev', href: prevSeries ?? '' },
          { rel: 'next', href: nextSeries ?? '' },
        ].filter((link) => link.href.length > 0)}
        additionalMetaTags={[{ name: 'author', content: 'Pedro Marquez-Soto' }]}
      />
      <Head>
        {images.map(image => image.replace("hero.webp", "devto.png")).map((image) => (
          <meta
            key="image"
            name="image"
            property="og:image"
            content={image}
          ></meta>
        ))}
      </Head>
    </>
  )
}

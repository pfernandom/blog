import { ArticleJsonLd, NextSeo } from "next-seo";
import { HTML5MetaTag } from "next-seo/lib/types";
import Head from "next/head";
import React from "react";
import { Post } from "src/models/interfaces";

export type BlogPostSEOProps = Post & {
  url: string;
  images: Array<string>;
  author: string;
};

const BLOG_POST_IMG_WIDTH = 440;
const BLOG_POST_IMG_HEIGHT = 220;

export default function BlogPostSEO({
  url,
  title,
  description,
  date,
  images,
  author,
  key_words,
  hero_image_alt,
}: BlogPostSEOProps) {
  const imageList = images.map((image) => ({
    url: image,
    width: BLOG_POST_IMG_WIDTH,
    height: BLOG_POST_IMG_HEIGHT,
    alt: hero_image_alt,
  }));

  return (
    <>
      <Head>
        {images.map((image) => (
          <meta
            prefix="og: http://ogp.me/ns#"
            key="image"
            name="image"
            property="og:image"
            content={image}
          ></meta>
        ))}
      </Head>
      <ArticleJsonLd
        type="Blog"
        url={url}
        title={title}
        images={images}
        datePublished={date}
        dateModified={date}
        authorName={author}
        description={description.join(". ")}
      />

      <NextSeo
        canonical="https://www.canonical.ie/"
        openGraph={{
          title,
          description: description.join(". ").slice(0, 95) + "...",
          url,
          type: "article",
          article: {
            publishedTime: date,
            modifiedTime: date,
            section: "Section II",
            authors: [author],
            tags: key_words,
          },
          images: imageList,
        }}
        additionalMetaTags={[{ name: "author", content: "Pedro Marquez-Soto" }]}
      />
    </>
  );
}

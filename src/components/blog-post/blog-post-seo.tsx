import { ArticleJsonLd, NextSeo } from "next-seo";
import React from "react";
import { Post } from "src/models/interfaces";

export type BlogPostSEOProps = Post & {
  url: string;
  images: Array<string>;
  author: string;
};

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
        description={description.join(". ")}
      />

      <NextSeo
        openGraph={{
          title,
          description: description.join(". "),
          url,
          type: "article",
          article: {
            publishedTime: date,
            modifiedTime: date,
            section: "Section II",
            authors: [author],
            tags: key_words,
          },
          images: images.map((image) => ({
            url: image,
            width: 850,
            height: 650,
            alt: hero_image_alt,
          })),
        }}
      />
    </>
  );
}

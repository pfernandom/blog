import React from "react";

import { NextPage } from "next";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import BlogPostActions from "src/components/blog-post/blog-post-actions";
import BlogPostSEO from "src/components/blog-post/blog-post-seo";
import { getAllPosts } from "src/helpers/page-fetcher";
import urlGetterFactory from "src/helpers/url-getter-factory";
import { Metadata, PostInfo } from "../models/interfaces";
import DynamicSlot from "src/components/blog-post/blog-post-dynamic-slot";
import BlogPostFooter from "src/components/blog-post/blog-post-footer";

export function getNextAndPrev(posts: Array<PostInfo>, currentPost: PostInfo) {
  const filtered = posts.filter((p) => p.frontmatter.published);

  const postIndex = filtered.findIndex((p) => p.slug === currentPost?.slug);
  let prevIndex = postIndex - 1;

  let nextIndex = postIndex + 1;

  const prev = prevIndex >= 0 ? filtered[prevIndex] : null;
  const next = nextIndex < filtered.length ? filtered[nextIndex] : null;

  return { prev, next };
}

type BlogPlaceholderParams = {
  metadata: Metadata;
  blog: Array<string>;
  post: PostInfo;
  posts: PostInfo[];
  host: string;
};

const BlogPlaceholder: NextPage<BlogPlaceholderParams> = ({
  post,
  posts,
  host,
}) => {
  const router = useRouter();
  const path: string[] = router.query.blog as string[];
  const getPageUrl = urlGetterFactory(host);
  const chunk = path.join("/");

  const prevAndNext = getNextAndPrev(posts, post);
  const { prev, next } = prevAndNext;

  const { frontmatter } = post;

  return (
    <div>
      <Script src="https://cpwebassets.codepen.io/assets/embed/ei.js"></Script>

      <BlogPostSEO
        url={getPageUrl(post.slug)}
        images={[
          getPageUrl(
            frontmatter.hero_image_original ?? frontmatter.hero_image,
            true
          ),
        ]}
        author={"Pedro Marquez-Soto"}
        {...post.frontmatter}
      ></BlogPostSEO>

      <BlogPostActions host={host} {...post} />

      <DynamicSlot chunk={chunk} />

      <BlogPostFooter prev={prev} next={next} />
    </div>
  );
};

export default BlogPlaceholder;

export async function getStaticProps({
  params,
}: {
  params: BlogPlaceholderParams;
}) {
  const posts: Array<PostInfo> = getAllPosts();

  const selectedPost = posts.find((post: PostInfo) => {
    return post.slug.includes(params.blog?.join("/"));
  });

  const host = process.env["SITE_URL"];
  return {
    props: {
      metadata: selectedPost?.frontmatter ?? {},
      blog: params.blog ?? [],
      post: selectedPost ?? {},
      posts: posts ?? [],
      host,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts();

  return {
    paths: posts.map((post) => {
      return {
        params: {
          blog: ["blog", ...post.slug.split("/").slice(1)],
        },
      };
    }),
    fallback: false,
  };
}

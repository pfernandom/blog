import React, { Suspense, useMemo, useEffect } from "react";

import { NextPage } from "next";
import { Metadata, PostInfo } from "../models/interfaces";
import { getAllPosts } from "src/helpers/page-fetcher";
import m from "src/imports";
import dynamic, { Loader } from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";

export function getNextAndPrev(posts: Array<PostInfo>, currentPost: PostInfo) {
  const filtered = posts.filter((p) => p.frontmatter.published);

  const postIndex = filtered.findIndex((p) => p.slug === currentPost?.slug);
  let prevIndex = postIndex - 1;

  let nextIndex = postIndex + 1;

  const prev = prevIndex >= 0 ? filtered[prevIndex] : null;
  const next = nextIndex < filtered.length ? filtered[nextIndex] : null;

  return { prev, next };
}

type ErrorParams = {
  metadata: Metadata;
  blog: Array<string>;
  post: PostInfo;
  posts: PostInfo[];
};

function DynamicSlot({ chunk }: { chunk: string }) {
  const DynamicBlogPost = useMemo(() => dynamic(m[chunk] as Loader), [chunk]);

  return (
    <Suspense fallback="Loading">
      <DynamicBlogPost />
    </Suspense>
  );
}

const BlogPlaceholder: NextPage<ErrorParams> = ({ blog, post, posts }) => {
  const router = useRouter();

  const path: string[] = router.query.blog as string[];

  const chunk = path.join("/");

  const prevAndNext = getNextAndPrev(posts, post);
  const { prev, next } = prevAndNext;

  return (
    <>
      <div className="blog-post-date">
        &#x1F4C6;{" "}
        <span className="blog-post-date-text">{post.frontmatter.date}</span>
      </div>

      <DynamicSlot chunk={chunk} />

      <ul
        style={{
          display: `flex`,
          flexWrap: `wrap`,
          justifyContent: `space-between`,
          listStyle: `none`,
          padding: 0,
        }}
      >
        <li style={{ flexBasis: "40%" }}>
          {prev && (
            <Link href={prev.slug}>
              <span> ← {prev.frontmatter.title} </span>
            </Link>
          )}
        </li>
        <li style={{ flexBasis: "40%" }}>
          {next && (
            <Link href={next.slug}>
              <span>{next.frontmatter.title} →</span>
            </Link>
          )}
        </li>
      </ul>
    </>
  );
};

export default BlogPlaceholder;

export async function getStaticProps({ params }: { params: ErrorParams }) {
  console.log("nav");

  const posts: Array<PostInfo> = getAllPosts();

  const selectedPost = posts.find((post: PostInfo) => {
    return post.slug.includes(params.blog?.join("/"));
  });

  return {
    props: {
      metadata: selectedPost?.frontmatter ?? {},
      blog: params.blog ?? [],
      post: selectedPost ?? {},
      posts: posts ?? [],
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

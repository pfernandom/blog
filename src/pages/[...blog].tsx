import React, { Suspense, useMemo, useEffect } from "react";

import { NextPage } from "next";
import { Metadata, PostInfo } from "../models/interfaces";
import { getAllPosts } from "src/helpers/page-fetcher";
import m from "src/imports";
import dynamic, { Loader } from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "src/components/image";
import ShareButtons from "src/components/share-buttons";
import { ArticleJsonLd, DefaultSeo } from "next-seo";

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
  host: string;
};

function DynamicSlot({ chunk }: { chunk: string }) {
  const DynamicBlogPost = useMemo(() => dynamic(m(chunk) as Loader), [chunk]);

  return (
    <div className="blog-post-content">
      <DynamicBlogPost />
    </div>
  );
}

const BlogPlaceholder: NextPage<ErrorParams> = ({
  post,
  posts,
  host,
  metadata,
}) => {
  const router = useRouter();

  function getPageUrl(slug: string, hasTrailingSlash: boolean = false) {
    const path = hasTrailingSlash ? slug.slice(1) : slug;
    return [host, "/", path].join("");
  }

  const path: string[] = router.query.blog as string[];

  const chunk = path.join("/");

  const prevAndNext = getNextAndPrev(posts, post);
  const { prev, next } = prevAndNext;

  // const heroImg = dynamic(
  //   import(
  //     `${post.frontmatter.hero_image
  //       .replace("/opt_images", "src")
  //       .replace("webp", "jpeg")}`
  //   )
  // );

  return (
    <div>
      <Head>
        <script
          async
          src="https://cpwebassets.codepen.io/assets/embed/ei.js"
        ></script>
      </Head>

      <ArticleJsonLd
        type="Blog"
        url={getPageUrl(post.slug)}
        title={post.frontmatter.title}
        images={[getPageUrl(post.frontmatter.hero_image, true)]}
        datePublished={post.frontmatter.date}
        dateModified={post.frontmatter.date}
        authorName={metadata.title}
        description={post.frontmatter.description.join(". ")}
      />

      <div className="blog-post-actions">
        <div className="blog-post-date">
          &#x1F4C6;{" "}
          <span className="blog-post-date-text">{post.frontmatter.date}</span>
        </div>

        <ShareButtons
          title={post.frontmatter.title}
          url={getPageUrl(post.slug)}
          author="Pedro Marquez"
          description={post.frontmatter.description.join(". ")}
        ></ShareButtons>
      </div>

      <DynamicSlot chunk={chunk} />

      <ul
        style={{
          display: `flex`,
          flexWrap: `wrap`,
          justifyContent: `space-between`,
          listStyle: `none`,
          marginTop: "3em",
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
    </div>
  );
};

export default BlogPlaceholder;

export async function getStaticProps({ params }: { params: ErrorParams }) {
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

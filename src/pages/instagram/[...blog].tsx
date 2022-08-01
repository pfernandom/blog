import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import InstagramEditTools from "src/components/instagram-post/edit-tools";
import { InstagramPost } from "src/models/InstagramPost";
import { getAllPosts } from "src/helpers/page-fetcher";
import { InstagramLinkParams, PostInfo } from "src/models/interfaces";
import { InstagramDataService } from "../api/instagram-post";

const InstagramLink: NextPage<InstagramLinkParams> = ({
  metadata,
  posts,
  post,
  instagramPostConfig,
}) => {
  if (!post || !post.frontmatter) {
    return <div>No post selected</div>;
  }
  return (
    <div>
      <Link href="/instagram">Go to all Instagram posts</Link>
      <InstagramEditTools post={post} defaultConfig={instagramPostConfig} />
    </div>
  );
};

export default InstagramLink;

export async function getStaticProps({
  params,
}: {
  params: InstagramLinkParams;
}) {
  const posts: Array<PostInfo> = getAllPosts();

  const selectedPost = posts.find((post: PostInfo) => {
    return post.slug.includes(params.blog?.join("/"));
  });

  const instagramService = new InstagramDataService();
  const instagramPostConfig: InstagramPost = instagramService.get(
    selectedPost?.slug ?? ""
  );

  const host = process.env["SITE_URL"];
  return {
    props: {
      metadata: selectedPost?.frontmatter ?? {},
      blog: params.blog ?? [],
      post: selectedPost ?? {},
      posts: posts ?? [],
      host,
      instagramPostConfig,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts();

  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    return {
      paths: [],
      fallback: false,
    };
  }

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
import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import InstagramPostView from "src/components/instagram-post/instagram-post-view";
import { InstagramPost } from "src/models/InstagramPost";
import { getDataFile } from "src/helpers/data-fetchers";
import { getAllPosts } from "src/helpers/page-fetcher";
import { Metadata, PostInfo } from "src/models/interfaces";
import { InstagramDataService } from "../api/instagram-post";
import { InstagramDefaultConfig } from "src/models/instagram-default-config";

export type InstagramLinksParams = {
  metadata: Metadata;
  blog: Array<string>;
  post: PostInfo;
  posts: PostInfo[];
  host: string;
  isProd: boolean;
  postToConfig: Record<string, InstagramPost>;
};

const InstagramLinks: NextPage<InstagramLinksParams> = ({
  metadata,
  posts,
  isProd,
  postToConfig,
}) => {
  return (
    <div className="instagram-posts">
      {posts.map((post) => (
        <div key={post.slug} className="instagram-post-tile">
          <Link href={post.slug}>
            <InstagramPostView
              post={post}
              currentConfig={new InstagramPost(postToConfig[post.slug])}
            />
          </Link>
          {!isProd && <Link href={`/instagram/${post.slug}`}>Edit</Link>}
        </div>
      ))}
    </div>
  );
};

export default InstagramLinks;

export async function getStaticProps() {
  const metadata: Metadata = await getDataFile("src/data/metadata.json");
  const posts: Array<PostInfo> = getAllPosts();
  const isProd = process.env.NODE_ENV === "production";

  const instagramService = new InstagramDataService();

  // posts.forEach((post) => {
  //   instagramService.save({
  //     slug: post.slug,
  //     instagramPost: InstagramDefaultConfig,
  //   });
  // });

  const allInstagramConfigs = posts.map((post) =>
    instagramService.get(post.slug)
  );

  const postToConfig = allInstagramConfigs.reduce(
    (acc, config) => ({ [config.slug ?? ""]: config, ...acc }),
    {}
  );

  return {
    props: {
      posts: posts ?? [],
      metadata: { ...metadata, title: "Instagram posts" },
      isProd,
      postToConfig,
    },
  };
}

import type { NextPage } from "next";
import Head from "next/head";
import Image from "src/components/image";

import React, { useContext } from "react";
import Link from "next/link";

import Bio from "../components/bio";
import { getDataFile } from "../helpers/data-fetchers";
import { getAllPosts } from "../helpers/page-fetcher";
import { rhythm } from "../utils/typography";
import { Metadata, PostInfo } from "../models/interfaces";
import { useRouter } from "next/router";
import generateRssFeed from "src/helpers/generate-rss-feed";

type HomeParams = {
  metadata: Metadata;
  posts: Array<PostInfo>;
};

const Home: NextPage<HomeParams> = ({ metadata, posts }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Bio metadata={metadata} />
      {posts
        .filter((post) => post.frontmatter.published)
        .map((post) => {
          const title = post.frontmatter.title || post.slug;
          const image = post.frontmatter.hero_image;

          return (
            <Link
              key={post.slug}
              style={{ display: `contents` }}
              href={post.slug}
            >
              <div
                className="link-post-container link-post-a"
                data-key={post.slug}
                onMouseEnter={() => {
                  router.prefetch(post.slug);
                }}
              >
                <div
                  style={{ width: 70, height: 70 }}
                  className="circle-image-container"
                >
                  {post.frontmatter.hero_image ? (
                    <Image
                      src={image}
                      className="circle-image"
                      alt={post.frontmatter.hero_image_alt}
                      placeholder="blur"
                      blurDataURL={post.frontmatter.hero_image_blur}
                      width={70}
                      height={70}
                      objectFit="cover"
                    />
                  ) : (
                    <div className="circle-image-empty"></div>
                  )}
                </div>

                <div className="link-content">
                  <h3
                    className="link-post"
                    style={{
                      marginBottom: rhythm(1 / 4),
                      marginTop: rhythm(1 / 8),
                    }}
                  >
                    {post.frontmatter.title}
                  </h3>
                  <small>{post.frontmatter.date}</small>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description.join("\n"),
                    }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
    </>
  );
};

export default Home;

export async function getStaticProps() {
  await generateRssFeed();
  const metadata: Metadata = await getDataFile("src/data/metadata.json");

  const posts: Array<PostInfo> = getAllPosts();

  return {
    props: {
      posts,
      metadata,
    },
  };
}

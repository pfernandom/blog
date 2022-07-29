import { Feed } from "feed";
import { Metadata } from "src/models/interfaces";
import { getDataFile } from "./data-fetchers";
import { getAllPosts } from "./page-fetcher";
import fs from "fs";

const generateRssFeed = async () => {
  const posts = await getAllPosts();
  const metadata: Metadata = await getDataFile("src/data/metadata.json");
  const siteURL = process.env.SITE_URL;
  const date = new Date();
  const author = {
    name: metadata.author,
    email: "pfernandom@gmail.com",
    link: "https://twitter.com/pfernandom",
  };
  const feed = new Feed({
    title: metadata.title,
    description: metadata.description,
    id: siteURL ?? "",
    link: siteURL,
    image: `${siteURL}/logo.svg`,
    favicon: `${siteURL}/favicon.png`,
    copyright: `All rights reserved ${date.getFullYear()}`,
    updated: date,
    generator: "Feed for Node.js",
    feedLinks: {
      rss2: `${siteURL}/rss/feed.xml`,
      json: `${siteURL}/rss/feed.json`,
      atom: `${siteURL}/rss/atom.xml`,
    },
    author,
  });
  posts.forEach((post) => {
    const url = `${siteURL}/${post.slug}`;
    feed.addItem({
      title: post.frontmatter.title,
      id: url,
      link: url,
      description: post.frontmatter.description.join(". "),
      content: post.frontmatter.description.join(". "),
      author: [author],
      contributor: [author],
      date: new Date(post.frontmatter.date),
    });
  });

  fs.mkdirSync("./public/rss", { recursive: true });
  fs.writeFileSync("./public/rss/feed.xml", feed.rss2());
  fs.writeFileSync("./public/rss/atom.xml", feed.atom1());
  fs.writeFileSync("./public/rss/feed.json", feed.json1());
};

export default generateRssFeed;

import remarkFrontmatter from "remark-frontmatter";
import rehypeHighlight from "rehype-highlight";
import withMDXFactory from "@next/mdx";
import { lowlight } from "lowlight/lib/all.js";
import dart from "highlight.js/lib/languages/dart";
import rehypePrism from "@mapbox/rehype-prism";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const withMDX = withMDXFactory({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    rehypePlugins: [rehypePrism],
    //remarkRehypeOptions: { languages: [dart] },
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: "@mdx-js/react",
  },
});

const nextConfig = withMDX({
  experimental: {
    newNextLinkBehavior: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  images: {
    domains: ["pedromarquez.dev", "localhost"],
    loader: "custom",
  },
});

export default nextConfig;

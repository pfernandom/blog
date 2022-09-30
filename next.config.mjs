import withMDXFactory from '@next/mdx'
import rehypeInlineCodeClassNamePlugin from 'rehype-inline-code-classname'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import withBundleAnalyzer from '@next/bundle-analyzer'
import rePrism from './plugins/rePrism.mjs'
import path from 'path'
import { GenerateSW } from 'workbox-webpack-plugin'

const bundle = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
const withMDX = withMDXFactory({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    rehypePlugins: [rehypeInlineCodeClassNamePlugin, rePrism],
    // remarkRehypeOptions: { allowDangerousHtml: true, languages: [dart] },
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: '@mdx-js/react',
  },
})

const nextConfig = bundle(
  withMDX({
    experimental: {
      newNextLinkBehavior: true,
    },
    productionBrowserSourceMaps: false,
    reactStrictMode: true,
    swcMinify: true,
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    images: {
      domains: ['pedromarquez.dev', 'localhost'],
      loader: 'custom',
    },
    //   generateBuildId: () => '$Format:%H$',
    //   webpack: (
    //     config,
    //     { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
    //   ) => {
    //     // config.plugins.push({
    //     //   apply(compiler) {
    //     //     compiler.hooks.compilation.tap('SWPkuin', (compilation, callback) => {
    //     //       console.log('compile', { compilation })
    //     //     })
    //     //   },
    //     // })
    //     // Important: return the modified config
    //     config.module.rules.push({
    //       test: /.+sw\.ts$/,
    //       use: [
    //         {
    //           loader: 'ts-loader',
    //           options: {
    //             transpileOnly: false,
    //             outDir: './public/',
    //           },
    //         },
    //       ],
    //     })
    //     return config
    //   },
  })
)

export default nextConfig

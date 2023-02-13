import withMDXFactory from '@next/mdx'
import rehypeInlineCodeClassNamePlugin from 'rehype-inline-code-classname'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import withBundleAnalyzer from '@next/bundle-analyzer'
import rePrism from './plugins/rePrism.mjs'
import remarkGfm from 'remark-gfm'
import { withSentryConfig } from '@sentry/nextjs'

const bundle = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const withMDX = withMDXFactory({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
    rehypePlugins: [rehypeInlineCodeClassNamePlugin, rePrism],
    // remarkRehypeOptions: { allowDangerousHtml: true, languages: [dart] },
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: '@mdx-js/react',
  },
})

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  dryRun:
    process.env.NODE_ENV !== 'production' || process.env.APP_ENV !== 'prod',
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}

export default withSentryConfig(
  bundle(
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
      sentry: {
        // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
        // for client-side builds. (This will be the default starting in
        // `@sentry/nextjs` version 8.0.0.) See
        // https://webpack.js.org/configuration/devtool/ and
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
        // for more information.
        hideSourceMaps: true,
      },
    })
  ),
  sentryWebpackPluginOptions
)

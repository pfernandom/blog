import '../styles/globals.scss'

import Layout from 'src/components/layout'
import { MDXProvider } from '@mdx-js/react'
import MDXComponentsDef from 'src/components/mdx/mdx-components'
import { DefaultSeo } from 'next-seo'
import Head from 'next/head'
import { useEffect } from 'react'
import registerSW from 'src/sw/register-sw'
import { BlogPlaceholderParams } from './blog/[...blog]'
import React from 'react'
import ErrorBoundary from 'src/components/error-boundary'

function MyApp({
  Component,
  pageProps,
}: {
  Component: typeof React.Component
  pageProps: BlogPlaceholderParams
}) {
  useEffect(() => {
    //ws://localhost:8000/_next/webpack-hmr
    if ('serviceWorker' in navigator) {
      registerSW(navigator, pageProps.isProd)
    }
  })

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0,maximum-scale=5"
        />
      </Head>
      <link
        rel="preload"
        href="/fonts/Montserrat-Regular.otf"
        as="font"
        type="font/otf"
      ></link>
      <link
        rel="preload"
        href="/fonts/Roboto-Regular.ttf"
        as="font"
        type="font/ttf"
      ></link>
      <link
        rel="preload"
        href="/fonts/futura-pt/FuturaPTMedium.otf"
        as="font"
        type="font/otf"
      ></link>
      <MDXProvider components={MDXComponentsDef}>
        <DefaultSeo
          title={pageProps.metadata?.title}
          description={pageProps.metadata?.description}
          twitter={{
            handle: '@pfernandom',
            site: '@site',
            cardType: 'summary_large_image',
          }}
          openGraph={{
            title: "Pedro's blog",
            description:
              'I am a full-stack software developer with a Master of Science in Computer Science and Machine Learning. I have more than 10 years of professional experience in multiple roles that cover application security, back-end, front-end development, and infrastructure development. I currently work as a full-stack engineer at LinkedIn.',
            url: 'https://pfernandom.github.io',
            type: 'profile',
            profile: {
              firstName: 'Pedro',
              lastName: 'Marquez-Soto',
              gender: 'male',
            },
            images: [
              {
                url: 'https://pedromarquez.dev/profile-pic.jpg]',
                width: 850,
                height: 650,
                alt: 'Profile Photo',
              },
            ],
          }}
        />
        <ErrorBoundary>
          <Layout title={pageProps?.metadata?.title ?? 'Blog entry'}>
            <Component {...pageProps} />
          </Layout>
        </ErrorBoundary>
        {/* </HelmetProvider> */}
      </MDXProvider>
    </>
  )
}

export default MyApp

import 'app/styles/globals.scss'
// import Head from 'next/head'
import React from 'react'

import { getDataFile } from 'app/helpers/data-fetchers'
import { Metadata as AppMetadata } from 'app/models/interfaces'
import { Metadata } from 'next'
import News from './_components/news'
import SocialPane from './_components/social'

export async function generateMetadata(): Promise<Metadata> {
  const metadata: AppMetadata = await getDataFile('src/app/_data/metadata.json')
  return metadata
}

// export const ThemeContext = React.createContext('light')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // useEffect(() => {
  //   //ws://localhost:8000/_next/webpack-hmr
  //   if ('serviceWorker' in navigator) {
  //     registerSW(navigator, pageProps.isProd)
  //   }
  // })

  return (
    <html lang="en">
      <body>
        {/* <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0,maximum-scale=5"
          />
        </Head> */}
        {/* <link
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
        ></link> */}

        {/* <ErrorBoundary> */}
        <News></News>
        <div className="layout-content">
          <div className="layout-header">
            {/* <header>{header}</header> */}
            <SocialPane />
          </div>
          <main className="main">{children}</main>
        </div>
        {/* </ErrorBoundary> */}
        {/* </HelmetProvider> */}
        {/* </MDXProvider> */}
        <footer>
          <a
            href="https://pfernandom.github.io"
            style={{ textDecoration: 'underline' }}
          >
            Pedro Marquez-Soto
          </a>{' '}
          © {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  )
}

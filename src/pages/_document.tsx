import React from 'react'
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'
import Script from 'next/script'

export const ThemeContext = React.createContext('light')

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage
    let helmetContext

    // Run the React rendering logic synchronously
    const page = (ctx.renderPage = () =>
      originalRenderPage({
        // Useful for wrapping the whole react tree
        enhanceApp: (App) => App,
        // Useful for wrapping in a per-page basis
        enhanceComponent: (Component) => Component,
      }))

    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx)

    return { ...initialProps, ...page, helmetContext, test: 'yeah' }
  }

  render() {
    return (
      <Html lang="en-US">
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-KEN0F81YMH"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-XV91RNV97M');
        `}
          </Script>

          <Script src="https://www.googleoptimize.com/optimize.js?id=OPT-TV9C6H7"></Script>
        </Head>
        <ThemeContext.Provider value="dark">
          <Main />

          <NextScript />
        </ThemeContext.Provider>
      </Html>
    )
  }
}

export default MyDocument

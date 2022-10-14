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
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css"
          />
          <Script
            src="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.1.1/cookieconsent.min.js"
            data-cfasync="false"
            strategy="afterInteractive"
          ></Script>
          <Script src="/cookieconsent.js" strategy="afterInteractive"></Script>

          <Script
            src="https://www.googleoptimize.com/optimize.js?id=OPT-TV9C6H7"
            strategy="afterInteractive"
          ></Script>
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

import "../styles/globals.css";
import type { AppProps } from "next/app";

import "highlight.js/styles/github-dark-dimmed.css";

import "typeface-montserrat";
import "typeface-merriweather";
import "prismjs/themes/prism.min.css";
import "prismjs/plugins/command-line/prism-command-line.css";
import Layout from "src/components/layout";
import { MDXProvider } from "@mdx-js/react";
import MDXComponentsDef from "src/components/mdx-components";
import News from "src/components/news";
import { ThemeContext } from "./_document";
import { PostInfo } from "src/models/interfaces";

function MyApp({
  Component,
  pageProps,
}: {
  Component: () => any;
  pageProps: any;
}) {
  return (
    <ThemeContext.Consumer>
      {(value) => {
        return (
          <MDXProvider components={MDXComponentsDef}>
            {/* <HelmetProvider context={this.helmetContext}> */}
            <Layout
              location="/"
              theme={value}
              title={pageProps?.metadata?.title ?? "Blog entry"}
            >
              <News></News>
              <Component {...pageProps} />
            </Layout>
            {/* </HelmetProvider> */}
          </MDXProvider>
        );
      }}
    </ThemeContext.Consumer>
  );
}

export default MyApp;

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
import { DefaultSeo } from "next-seo";

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
            <DefaultSeo
              title={pageProps.metadata?.title}
              description={pageProps.metadata?.description}
              twitter={{
                handle: "@pfernandom",
                site: "@site",
                cardType: "summary_large_image",
              }}
            />
            <Layout
              location="/"
              theme={value}
              title={pageProps?.metadata?.title ?? "Blog entry"}
            >
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

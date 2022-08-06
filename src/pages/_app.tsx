import "../styles/globals.css";
import "highlight.js/styles/github-dark-dimmed.css";

import "prismjs/themes/prism.min.css";
import "prismjs/plugins/command-line/prism-command-line.css";
import Layout from "src/components/layout";
import { MDXProvider } from "@mdx-js/react";
import MDXComponentsDef from "src/components/mdx-components";
import { ThemeContext } from "./_document";
import { DefaultSeo } from "next-seo";
import Head from "next/head";

function MyApp({
  Component,
  pageProps,
}: {
  Component: () => any;
  pageProps: any;
}) {
  return (
    <>
      <link
        rel="preload"
        href="/fonts/Montserrat-Regular.otf"
        as="font"
        type="font/opentype"
      ></link>
      <link
        rel="preload"
        href="/fonts/Roboto-Regular.ttf"
        as="font"
        type="font/ttf"
      ></link>
      <MDXProvider components={MDXComponentsDef}>
        <DefaultSeo
          title={pageProps.metadata?.title}
          description={pageProps.metadata?.description}
          twitter={{
            handle: "@pfernandom",
            site: "@site",
            cardType: "summary_large_image",
          }}
          openGraph={{
            title: "Pedro's blog",
            description:
              "I am a full-stack software developer with a Master of Science in Computer Science and Machine Learning. I have more than 10 years of professional experience in multiple roles that cover application security, back-end, front-end development, and infrastructure development. I currently work as a full-stack engineer at LinkedIn.",
            url: "https://pfernandom.github.io",
            type: "profile",
            profile: {
              firstName: "Pedro",
              lastName: "Marquez-Soto",
              gender: "male",
            },
            images: [
              {
                url: "https://pedromarquez.dev/profile-pic.jpg]",
                width: 850,
                height: 650,
                alt: "Profile Photo",
              },
            ],
          }}
        />
        <Layout location="/" title={pageProps?.metadata?.title ?? "Blog entry"}>
          <Component {...pageProps} />
        </Layout>
        {/* </HelmetProvider> */}
      </MDXProvider>
    </>
  );
}

export default MyApp;

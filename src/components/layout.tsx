import React from "react";
import Link from "next/link";
import { ReactNode } from "react";

import { rhythm, scale } from "../utils/typography";
import { useRouter } from "next/router";
import { ThemeContext } from "src/pages/_document";
import SocialPane from "./social";
import { PostInfo } from "src/models/interfaces";
import News from "./news";

function Layout({
  location,
  title,
  children,
  theme,
}: {
  location: string;
  title: string;
  children: ReactNode;
  theme: string;
}) {
  // eslint-disable-next-line no-undef
  let header;
  const router = useRouter();

  if (router.route === "/") {
    header = (
      <h1
        style={{
          ...scale(1),
          marginBottom: rhythm(1),
          marginTop: 0,
        }}
      >
        {title}
      </h1>
    );
  } else {
    header = (
      <>
        <div style={{ marginBottom: "1em" }}>
          <Link href="/"> &larr; Back to all posts</Link>
        </div>
        <h1
          style={{
            fontFamily: `Montserrat, sans-serif`,
            marginTop: 0,
          }}
        >
          {title}
        </h1>
      </>
    );
  }
  return (
    <>
      <News></News>
      <div className="layout-content">
        <header>{header}</header>
        <SocialPane />
        <main className="main">{children}</main>

        <footer>
          <a
            href="https://pfernandom.github.io"
            style={{ textDecoration: "underline" }}
          >
            Pedro Marquez-Soto
          </a>{" "}
          © {new Date().getFullYear()}
        </footer>
      </div>
    </>
  );
}

export default Layout;

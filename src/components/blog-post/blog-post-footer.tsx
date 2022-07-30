import Link from "next/link";
import React from "react";
import { PostInfo } from "src/models/interfaces";

type BlogPostFooter = {
  prev?: PostInfo | null;
  next?: PostInfo | null;
};

export default function BlogPostFooter({ prev, next }: BlogPostFooter) {
  return (
    <ul
      style={{
        display: `flex`,
        flexWrap: `wrap`,
        justifyContent: `space-between`,
        listStyle: `none`,
        marginTop: "3em",
        padding: 0,
      }}
    >
      <li style={{ flexBasis: "40%" }}>
        {prev && (
          <Link href={prev.slug}>
            <span> ← {prev.frontmatter.title} </span>
          </Link>
        )}
      </li>
      <li style={{ flexBasis: "40%" }}>
        {next && (
          <Link href={next.slug}>
            <span>{next.frontmatter.title} →</span>
          </Link>
        )}
      </li>
    </ul>
  );
}

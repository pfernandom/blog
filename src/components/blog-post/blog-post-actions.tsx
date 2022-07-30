import React from "react";
import urlGetterFactory from "src/helpers/url-getter-factory";
import { PostInfo } from "src/models/interfaces";
import ShareButtons from "../share-buttons";

export default function BlogPostActions({
  slug,
  frontmatter: { date, title, description },
  host,
}: PostInfo & { host: string }) {
  const getPageUrl = urlGetterFactory(host);

  return (
    <div className="blog-post-actions">
      <div className="blog-post-date">
        &#x1F4C6; <span className="blog-post-date-text">{date}</span>
      </div>

      <ShareButtons
        title={title}
        url={getPageUrl(slug)}
        author="Pedro Marquez"
        description={description.join(". ")}
      ></ShareButtons>
    </div>
  );
}

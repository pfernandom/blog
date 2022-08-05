import fs from "fs";
import path, { join } from "path";

import prettier from "prettier";
import { getAllFiles, postsDirectory, getPostByFileInfo } from "./common";

const getDate = new Date().toISOString();

const YOUR_AWESOME_DOMAIN = "https://pedromarquez.dev";

const formatted = (sitemap: string) =>
  prettier.format(sitemap, { parser: "html" });

(async () => {
  const regexExt = /\.(tsx|mdx)$/gi;

  const slugs = getAllFiles(postsDirectory, regexExt, []);

  const pages = slugs
    .filter((slug) => getPostByFileInfo(slug) != null)
    .map((f) => join("blog", f.filePath));

  const pagesSitemap = `
    ${pages
      .map((page) => {
        const path = page
          .replace("../pages/", "")
          .replace(".mdx", "")
          .replace(/\/index/g, "");
        const routePath = path === "index" ? "" : path;
        return `
          <url>
            <loc>${YOUR_AWESOME_DOMAIN}/${routePath}</loc>
            <lastmod>${getDate}</lastmod>
          </url>
        `;
      })
      .join("")}
  `;

  const generatedSitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    >
      ${pagesSitemap}
    </urlset>
  `;

  const formattedSitemap = formatted(generatedSitemap);

  const fileP = join(process.cwd(), "public", "sitemap-common.xml");

  fs.writeFileSync(fileP, formattedSitemap, "utf8");
})();

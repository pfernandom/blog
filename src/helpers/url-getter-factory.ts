import path from "path";

export default function urlGetterFactory(host: string) {
  function getPageUrl(slug: string, hasTrailingSlash: boolean = false) {
    const fullPath = hasTrailingSlash ? slug.slice(1) : slug;
    return path.join(host, fullPath);
  }

  return getPageUrl;
}

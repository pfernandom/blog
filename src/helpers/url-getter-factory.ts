export default function urlGetterFactory(host: string) {
  function getPageUrl(slug: string, hasTrailingSlash: boolean = false) {
    const path = hasTrailingSlash ? slug.slice(1) : slug;
    return [host, "/", path].join("");
  }

  return getPageUrl;
}

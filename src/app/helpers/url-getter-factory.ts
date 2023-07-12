
export default function urlGetterFactory(host: string) {
  function getPageUrl(slug: string, hasTrailingSlash = false) {
    const fullPath = hasTrailingSlash ? slug.slice(1) : slug
    return new URL(fullPath, host).href
  }

  return getPageUrl
}

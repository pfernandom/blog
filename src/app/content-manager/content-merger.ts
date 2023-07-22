import { getNextAndPrevSeries } from 'app/_components/blog-post/blog-post-series'
import urlGetterFactory from 'app/helpers/url-getter-factory'
import { ReactElement } from 'rehype-react/lib'
import { LocalContentManager, Post } from './manager'
import { StaticContentManager } from './static-content-manager'

interface PostRenderData {
  post: Post
  isPartOfSeries: boolean
  seriesPosts: Post[]
  prev: Post | null
  next: Post | null
  seoImages?: string[]
  pageLinks?: { next: string | null; prev: string | null }
}

interface MdxPostRenderData extends PostRenderData {
  postPath: string
}

interface MdPostRenderData extends PostRenderData {
  content: ReactElement
}

interface PostUnion {
  slug: string
  postInfo: Post
  isMDX: boolean
}

export default class ContentMerger {
  allPosts: PostUnion[]

  constructor() {
    const contentManager = new LocalContentManager()
    const staticContentManager = new StaticContentManager()
    this.allPosts = [
      ...contentManager.fetchAllSync().map((mdxContent) => ({
        slug: mdxContent.slug.replace('blog/', ''),
        postInfo: mdxContent.frontmatter,
        isMDX: true,
      })),
      ...staticContentManager
        .getStaticPostsPaths()
        .map((p) => p.content)
        .filter((postInfo) => postInfo.slug)
        .map((postInfo) => ({
          slug: (postInfo.slug as string).replace('blog/', '') as string,
          postInfo,
          isMDX: false,
        })),
    ].sort(
      (a, b) =>
        new Date(b.postInfo.date).getTime() -
        new Date(a.postInfo.date).getTime()
    )
  }

  isPost(slug: string) {
    return this.allPosts.find((post) => post.slug === slug) ? true : false
  }

  isMDXPost(slug: string): boolean {
    return this.allPosts.find((post) => post.slug === slug)?.isMDX ?? false
  }

  fetchMDXContent(slug: string): MdxPostRenderData | null {
    if (!this.isMDXPost(slug)) {
      return null
    }
    const host = process.env['SITE_URL'] ?? ''
    const contentManager = new LocalContentManager()
    const allPosts = contentManager.fetchAllSync()

    const postsAndPaths: Array<[Post, string]> = allPosts.map((post) => {
      if (!post.frontmatter.slug) {
        post.frontmatter.slug = post.slug
        // TODO: Clean things so this is not necessary
        post.frontmatter.slug = post.frontmatter.slug.replace('blog/', '')
      }
      return [post.frontmatter, post.postPath]
    })

    // TODO: Handle default case
    const postAndPath = postsAndPaths.find((post) => {
      return post[0].slug?.endsWith(slug)
    })

    if (!postAndPath) {
      return null
    }
    const [post, postPath] = postAndPath
    const posts = postsAndPaths.map(([post]) => post)

    const seriesPosts = posts.filter(
      (p) => p.series && p.series === post?.series
    )

    const getPageUrl = urlGetterFactory(host)
    const prevAndNext = getNextAndPrev(this.allPosts, post)
    const { prevInSeries, nextInSeries } = getNextAndPrevSeries(
      post,
      seriesPosts
    )
    const { prev, next } = prevAndNext

    const seoImages = [post.hero_image_original ?? null, post.hero_image]
      .filter((img) => img != null)
      .map((img) => getPageUrl(img as string, true))

    const isPartOfSeries = seriesPosts.length > 1
    const prevInSeriesSlug = prevInSeries[prevInSeries.length - 1]?.slug
    const nextInSeriesSlug = nextInSeries[0]?.slug
    const prevS =
      prevInSeries.length > 0 && prevInSeriesSlug
        ? getPageUrl(prevInSeriesSlug)
        : null
    const nextS =
      nextInSeries.length > 0 && nextInSeriesSlug
        ? getPageUrl(nextInSeriesSlug)
        : null

    return {
      post,
      isPartOfSeries,
      seriesPosts,
      prev,
      next,
      seoImages,
      postPath,
      pageLinks: { next: nextS, prev: prevS },
    }
  }

  fetchStaticContent(slug: string): MdPostRenderData | null {
    if (this.isMDXPost(slug)) {
      return null
    }
    const contentManager = new StaticContentManager()
    const components = contentManager.getStaticPosts()
    const pagePost = components.find((c) => {
      return c.data['slug']?.replace('blog/', '') === slug
    })

    const content = pagePost?.content
    const postData = pagePost

    if (content && postData && postData.data) {
      const prevAndNext = getNextAndPrev(this.allPosts, postData.data)
      const { prev, next } = prevAndNext
      return {
        content,
        post: postData.data,
        isPartOfSeries: false,
        seriesPosts: [],
        prev,
        next,
      }
    }
    return null
  }
}

function getNextAndPrev(posts: Array<PostUnion>, currentPost: Post) {
  const filtered = posts.filter((p) => p.postInfo.published)

  const postIndex = filtered.findIndex((p) => p.slug === currentPost?.slug)
  const prevIndex = postIndex - 1

  const nextIndex = postIndex + 1

  const prev = prevIndex >= 0 ? filtered[prevIndex].postInfo : null
  const next = nextIndex < filtered.length ? filtered[nextIndex].postInfo : null

  return { prev, next }
}

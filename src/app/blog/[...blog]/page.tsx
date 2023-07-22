import DynamicSlot from 'app/_components/blog-post/blog-post-dynamic-slot'
import { getNextAndPrevSeries } from 'app/_components/blog-post/blog-post-series'
import { BlogPageComponent } from 'app/blog/[...blog]/blog-page'
import ContentMerger from 'app/content-manager/content-merger'
import { LocalContentManager } from 'app/content-manager/manager'
import { StaticContentManager } from 'app/content-manager/static-content-manager'
import urlGetterFactory from 'app/helpers/url-getter-factory'
import { DynamicPageParams, StaticParams } from 'blog_constants'
import { Metadata } from 'next'
import { Post } from '../../models/interfaces'
import { getBlogPostSEO } from './metadata'
import Oops from './oops'

type Props = DynamicPageParams<['blog']>

function getNextAndPrev(posts: Array<Post>, currentPost: Post) {
  const filtered = posts.filter((p) => p.published)

  const postIndex = filtered.findIndex((p) => p.slug === currentPost?.slug)
  const prevIndex = postIndex - 1

  const nextIndex = postIndex + 1

  const prev = prevIndex >= 0 ? filtered[prevIndex] : null
  const next = nextIndex < filtered.length ? filtered[nextIndex] : null

  return { prev, next }
}

function getPageData(slug: string) {
  const host = process.env['SITE_URL'] ?? ''
  const contentManager = new LocalContentManager()

  const allPosts = contentManager.fetchAllSync()

  const postsAndPaths: Array<[Post, string]> = allPosts.map((post) => {
    if (!post.frontmatter.slug) {
      post.frontmatter.slug = post.slug
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

  const seriesPosts = posts.filter((p) => p.series && p.series === post?.series)

  const getPageUrl = urlGetterFactory(host)
  const prevAndNext = getNextAndPrev(posts, post)
  const { prevInSeries, nextInSeries } = getNextAndPrevSeries(post, seriesPosts)
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
    host,
    seriesPosts,
    prev,
    next,
    seoImages,
    postPath,
    pageLinks: { next: nextS, prev: prevS },
  }
}

// or Dynamic metadata
export async function generateMetadata({
  params,
}: Props): // parent: ResolvingMetadata
Promise<Metadata> {
  const pageData = getPageData(params['blog'].join('/'))
  if (!pageData) {
    return {}
  }
  const { post, seoImages, pageLinks } = pageData
  return getBlogPostSEO(post, seoImages, pageLinks)
}

export default async function BlogPage({
  params,
}: {
  params: { blog: string[] }
}) {
  const host = process.env['SITE_URL'] ?? ''
  const contentMerger = new ContentMerger()
  const slug = params['blog'].join('/')
  if (!contentMerger.isPost(slug)) {
    return (
      <Oops
        message={'Blog post not in list'}
        slug={slug}
        allSlugs={contentMerger.allPosts.map((p) => p.slug)}
      />
    )
  }

  if (contentMerger.isMDXPost(slug)) {
    const maybePost = contentMerger.fetchMDXContent(slug)
    if (!maybePost) {
      return (
        <Oops message={'Post identified as MDX, but it has no MDX content'} />
      )
    }
    const { post, postPath, isPartOfSeries, seriesPosts, prev, next } =
      maybePost

    return (
      <BlogPageComponent
        title={post.title}
        isPartOfSeries={isPartOfSeries}
        seriesSlug={post.series as string}
        post={post}
        host={host}
        seriesPosts={seriesPosts}
        prev={prev}
        next={next}
      >
        <DynamicSlot postPath={postPath} />
      </BlogPageComponent>
    )
  }

  const maybeStaticPost = contentMerger.fetchStaticContent(slug)

  if (maybeStaticPost) {
    const { content, post, isPartOfSeries, seriesPosts, prev, next } =
      maybeStaticPost

    return (
      <BlogPageComponent
        title={post.title}
        isPartOfSeries={isPartOfSeries}
        seriesSlug={post.series as string}
        seriesPosts={seriesPosts}
        post={post}
        host={host}
        prev={prev}
        next={next}
      >
        {content}
      </BlogPageComponent>
    )
  }

  return <Oops message={'Not static nor MDX'} />
}

export async function generateStaticParams(): StaticParams<['blog']> {
  const contentManager = new LocalContentManager()

  const posts = await contentManager.fetchAll()

  const staticContentManager = new StaticContentManager()
  const staticPosts = staticContentManager.getStaticPostsPaths()

  const params = staticPosts
    .filter((post) => post.content.slug)
    .map((post) => post.content.slug as string)
    .map((slug) => {
      return {
        blog: [...slug.split('/').slice(1)],
      }
    })

  const paths = posts
    .filter((post) => post.frontmatter.subblog_slug?.includes('software'))
    .map((post) => {
      return {
        blog: [...post.slug.split('/').slice(1)],
      }
    })

  return [...paths, ...params]
}

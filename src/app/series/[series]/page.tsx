import PostsList from 'app/_components/home/posts-list'
import mapSeriesSlutToTitle from 'app/helpers/blog-series-slug'
import { getAllPosts } from 'app/helpers/page-fetcher'
import { PostInfo } from 'app/models/interfaces'
import Link from 'next/link'
import { DynamicPageParams, StaticParams } from 'blog_constants'

const Home = async ({ params }: DynamicPageParams<'series'>) => {
  const posts: Array<PostInfo> = getAllPosts().filter(
    (post) => post.frontmatter.series === params.series
  )

  const title = `Blogs Series: ${mapSeriesSlutToTitle(params.series)}`

  return (
    <>
      <header>
        <div style={{ marginBottom: '1em' }}>
          <Link href="/"> &larr; Back to all posts</Link>
        </div>
        <h1>{title}</h1>
      </header>

      <PostsList posts={posts.filter((post) => post.frontmatter.published)} />
    </>
  )
}

export default Home

export async function generateStaticParams(): StaticParams<'series'> {
  const posts = getAllPosts()

  const postsWithSeries = new Set(
    posts
      .filter((post) => post.frontmatter.series)
      .map((post) => post.frontmatter.series) as string[]
  )

  return Array.from(postsWithSeries).map((series) => {
    return {
      series,
    }
  })
}

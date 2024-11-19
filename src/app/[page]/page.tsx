import HomePagination from 'app/_components/home-pagination'
import PostsList from 'app/_components/home/posts-list'
import Bio from '../_components/bio'
import { getDataFile } from '../helpers/data-fetchers'
import { getAllPosts } from '../helpers/page-fetcher'
import { Metadata, PostInfo } from '../models/interfaces'
import { StaticParams } from 'blog_constants'

const POSTS_PER_PAGE = 5

function getTotalPages(postsCount: number) {
  return (
    Math.floor(postsCount / POSTS_PER_PAGE) +
    (postsCount % POSTS_PER_PAGE > 0 ? 1 : 0)
  )
}

const HomePage = async ({ params }: { params: { page: string } }) => {
  const { page } = params
  const allPosts = getAllPosts()
  const postsCount = getAllPosts().length
  const totalPages = getTotalPages(postsCount)

  const start = (parseInt(page) - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE

  const metadata: Metadata = await getDataFile('src/app/_data/metadata.json')

  const posts: Array<PostInfo> = allPosts.slice(start, end).map((post) => {
    post.content = ''
    return post
  })

  return (
    <>
      <Bio metadata={metadata} />
      <PostsList posts={posts} />
      <HomePagination page={parseInt(page)} totalPages={totalPages} />
    </>
  )
}

export default HomePage

export async function generateStaticParams(): StaticParams<'page'> {
  const postsCount = getAllPosts().length
  const total = getTotalPages(postsCount)

  const paths = Array(total)
    .fill(0)
    .map((el, index) => ({
      page: (index + 2).toString(),
    }))

  return paths
}

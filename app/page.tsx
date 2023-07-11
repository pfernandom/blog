import Bio from 'app/_components/bio'
import HomePagination from 'app/_components/home-pagination'
import PostsList from 'app/_components/home/posts-list'
import { getAllPosts } from 'app/helpers/page-fetcher'
import { PostInfo } from 'app/models/interfaces'

const POSTS_PER_PAGE = 5

function getTotalPages(postsCount: number) {
  return (
    Math.floor(postsCount / POSTS_PER_PAGE) +
    (postsCount % POSTS_PER_PAGE > 0 ? 1 : 0)
  )
}
// import path from 'path'
// import { LocalContentManager } from './content-manager/manager'

const Home = async () => {
  const metadata = {
    title: '?',
    description: '?',
    author: 'Pedro',
  }

  // const contentDir = path.join(process.cwd(), 'app', 'content')
  // console.log({ contentDir })
  // const contentManager = new LocalContentManager(contentDir)
  // const subblogs = await contentManager.findSubBlogs()
  // const allPosts = await contentManager.fetchAll(subblogs[0])
  const allPosts = getAllPosts()

  const postsCount = allPosts.length
  const totalPages = getTotalPages(postsCount)

  const posts: Array<PostInfo> = allPosts
    .slice(0, POSTS_PER_PAGE)
    .map((post) => {
      post.content = ''
      return post
    })

  return (
    <>
      {/* <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <Bio metadata={metadata} />
      <PostsList posts={posts} />

      <HomePagination page={1} totalPages={totalPages} />
    </>
  )
}

export default Home

// export async function getStaticProps() {
//   const metadata: Metadata = await getDataFile('app/data/metadata.json')

//   const allPosts = getAllPosts()
//   const postsCount = getAllPosts().length
//   const totalPages = getTotalPages(postsCount)

//   const posts: Array<PostInfo> = allPosts
//     .slice(0, POSTS_PER_PAGE)
//     .map((post) => {
//       post.content = ''
//       return post
//     })

//   return {
//     props: {
//       posts,
//       metadata,
//       totalPages,
//     },
//   }
// }

import Head from 'next/head'

import PostsList from 'app/_components/home/posts-list'
import Bio from '../../_components/bio'
import { getDataFile } from '../../helpers/data-fetchers'
import { getAllPosts } from '../../helpers/page-fetcher'
import { Metadata, PostInfo } from '../../models/interfaces'
import { DynamicPageParams, StaticParams } from 'blog_constants'

const TagHomePage = async ({ params }: DynamicPageParams<'tag'>) => {
  const allPosts = getAllPosts().filter((post) =>
    post.frontmatter.key_words.includes(params.tag)
  )

  const metadata: Metadata = await getDataFile('src/app/_data/metadata.json')

  const posts: Array<PostInfo> = allPosts.map((post) => {
    post.content = ''
    return post
  })

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Bio metadata={metadata} />
      <h2 style={{ marginTop: 0 }}>Tag: {params.tag}</h2>

      <PostsList posts={posts} />
      {/* <HomePagination page={page} totalPages={totalPages} /> */}
    </>
  )
}

export default TagHomePage

export async function generateStaticParams(): StaticParams<'tag'> {
  const tags = new Set(
    getAllPosts()
      .flatMap((post) => post.frontmatter.key_words)
      .map((el) => el.trim())
  )

  const paths = new Array(...tags).map((tag) => ({
    tag,
  }))

  return paths
}

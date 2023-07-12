import { LocalContentManager } from 'app/content-manager/manager'
import { describe, expect, test } from '@jest/globals'

describe('Legacy posts', function () {
  test('Legacy routes snapshots', async function () {
    // const posts = getAllPosts()
    const contentManager = new LocalContentManager()

    const posts = await contentManager.fetchAll()

    const paths = posts
      .filter((post) => post.frontmatter.legacy)
      .map((post) => post.slug)

    expect(paths).toMatchSnapshot()
  })
})

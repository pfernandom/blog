import { LocalContentManager } from 'app/content-manager/manager'
import { describe, expect, test } from '@jest/globals'
import fs from 'fs'
import path from 'path'

describe('Content Manager', function () {
  test('Fetches all subblogs', async function () {
    const contentManager = new LocalContentManager()

    const subblogs = await contentManager.findSubBlogs()

    expect(subblogs).toMatchSnapshot()
  })

  test('Fetches all posts for a subblog', async function () {
    const contentManager = new LocalContentManager()

    const posts = await contentManager.fetchAll()

    expect(posts.map((post) => post.slug)).toMatchSnapshot()
    expect(posts.map((post) => post.postPath)).toMatchSnapshot()
    const heroImage = path.join('public', posts[0].frontmatter.hero_image)
    try {
      expect(fs.existsSync(heroImage)).toBe(true)
    } catch (err) {
      throw new Error(`${heroImage} does not exist:\n ${err}`)
    }
  })
})

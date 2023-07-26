import { describe, expect, test } from '@jest/globals'
import { fromFrontMatter } from 'app/content-manager/unified/frontmatter'
import { globSync } from 'glob'
import fs from 'node:fs'
import path from 'path'

describe('Smoke tests', function () {
  test('Snapshot: All posts have the expected information', async function () {
    const cutoutDate = new Date('2023-07-22')

    const staticPosts = globSync(path.join('content/**/*.md'))
    const mdxPosts = globSync(path.join('src', 'blog', 'content/**/*.mdx'))

    const posts = [...staticPosts, ...mdxPosts]
      .map((p) => fs.readFileSync(p, 'utf8'))
      .map((p) => fromFrontMatter(p))
      .filter(
        (content) =>
          (content?.date ? new Date(content.date) : new Date()).getTime() <
          cutoutDate.getTime()
      )

    expect(posts).toMatchSnapshot()
  })
})

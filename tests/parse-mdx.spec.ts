import { describe, expect, test } from '@jest/globals'
import fs from 'fs'
import parseMDX from 'app/content-manager/helpers/parse_mdx'
import { CONTENT_PATH } from 'blog_constants'

describe('parseMDX', function () {
  test('it works correctly', async function () {
    const imagesPath = 'public/opt_images/content/software/1988/0_test_post'
    const testPost = CONTENT_PATH + '/software/1988/0_test_post/index.mdx'
    const fileContents = fs.readFileSync(testPost, 'utf8')

    const { postData, content } = parseMDX({
      fileContents,
      imagesPath,
    })

    expect(postData.test).toBe(true)
    expect(fs.existsSync(postData.hero_image)).toBe(true)
    expect(postData).toMatchSnapshot()
    expect(content).toMatchSnapshot()
  })
})

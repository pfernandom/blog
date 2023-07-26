import { describe, expect, test } from '@jest/globals'
import ContentMerger from 'app/content-manager/content-merger'

describe('Content Merger', function () {
  test('Fetches all posts', async function () {
    const contentMerger = new ContentMerger()

    const posts = contentMerger.allPosts

    expect(posts.length > 0).toBe(true)
    posts.forEach((post) => {
      expect(post.slug).toBeTruthy()
      expect(post.postInfo.date).toBeTruthy()
      expect(post.postInfo.title).toBeTruthy()
      expect(
        post.postInfo.published !== null &&
          post.postInfo.published !== undefined
      ).toBeTruthy()
    })
    expect(posts.find((post) => !post.isMDX)).toBeTruthy()
  })

  test('Fetches test static post', async function () {
    const contentMerger = new ContentMerger()
    const testSlug = '1988/6/mypost'
    expect(contentMerger.allPosts.find((p) => p.slug === testSlug)).toBeTruthy()
    expect(contentMerger.isMDXPost(testSlug)).toBeFalsy()
    expect(contentMerger.fetchMDXContent(testSlug)).toBeFalsy()
    expect(contentMerger.fetchStaticContent(testSlug)).toBeTruthy()
  })
})

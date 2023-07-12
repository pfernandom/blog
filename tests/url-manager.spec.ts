import { describe, expect, test } from '@jest/globals'
import UrlManager from 'app/content-manager/url-manager'
import { CONTENT_PATH } from 'blog_constants'

describe('UrlManager', function () {
  test('it works correctly', async function () {
    const urlManager = new UrlManager()
    const date = '2023-02-13'
    const slug = urlManager.getSlugFromFilePath(
      CONTENT_PATH + '/software/2023/1_node_golang_wasm',
      { date, legacy: false }
    )

    expect(slug).toBe('blog/software/2023/2/node_golang_wasm')
  })

  test('it works correctly with file extension', async function () {
    const urlManager = new UrlManager()
    const date = '2023-02-13'
    const slug = urlManager.getSlugFromFilePath(
      CONTENT_PATH + '/software/2023/1_node_golang_wasm/index.mdx',
      { date, legacy: false }
    )

    expect(slug).toBe('blog/software/2023/2/node_golang_wasm')
  })

  test('it works correctly for legacy urls', async function () {
    const urlManager = new UrlManager()
    const date = '2023-02-13'
    const slug = urlManager.getSlugFromFilePath(
      CONTENT_PATH + '/software/2023/1_node_golang_wasm',
      { date, legacy: true }
    )

    expect(slug).toBe('blog/2023/2/node_golang_wasm')
  })

  test('it works correctly for legacy urls with file extension', async function () {
    const urlManager = new UrlManager()
    const date = '2023-02-13'
    const slug = urlManager.getSlugFromFilePath(
      CONTENT_PATH + '/software/2023/1_node_golang_wasm/index.mdx',
      { date, legacy: true }
    )

    expect(slug).toBe('blog/2023/2/node_golang_wasm')
  })

  test('it returns the images path correctly', async function () {
    const urlManager = new UrlManager()
    const imagesPath = urlManager.getImagesDir(
      CONTENT_PATH + '/software/2023/1_node_golang_wasm'
    )

    expect(imagesPath).toBe(
      'opt_images/content/software/2023/1_node_golang_wasm'
    )
  })

  test('it returns the subblog name path correctly', async function () {
    const urlManager = new UrlManager()
    const imagesPath = urlManager.getSubBlogName(
      CONTENT_PATH + '/software/2023/1_node_golang_wasm'
    )

    expect(imagesPath).toBe('software')
  })
})

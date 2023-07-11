import { LocalContentManager } from '../app/content-manager/manager'
import assert from 'assert'
import path from 'path'

describe('Content Manager', function () {
  beforeEach(async function () {
    console.log('')
  })

  it('Fetches all subblogs', async function () {
    const contentDir = path.join(process.cwd(), 'app', 'content')
    const contentManager = new LocalContentManager(contentDir)

    const subblogs = await contentManager.findSubBlogs()

    assert.ok(subblogs.length > 0)
  })

  it('Fetches all posts', async function () {
    const contentDir = path.join(process.cwd(), 'app', 'content')
    const contentManager = new LocalContentManager(contentDir)

    const subblogs = await contentManager.findSubBlogs()
    const posts = await contentManager.fetchAll(subblogs[0])
    console.log({ posts: posts.map(({ content, ...rest }) => rest) })

    assert.ok(posts.length > 0)
  })
})

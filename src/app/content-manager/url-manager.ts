import { CONTENT_PATH } from 'blog_constants'
import { Post } from './manager'

const SOURCE_ROOT = 'src/app'
const CONTENT_ROOT = CONTENT_PATH
const MDX_EXTENSION = '/index.mdx'

export default class UrlManager {
  subBlogRegex: RegExp

  constructor() {
    this.subBlogRegex = new RegExp(`${CONTENT_ROOT}/(\\w+)/`)
  }

  getSubBlogName(postPath: string) {
    const res = this.subBlogRegex.exec(postPath)
    return res ? res[1] : 'root'
  }

  getImagesDir(postPath: string) {
    return postPath
      .replace(SOURCE_ROOT, 'opt_images')
      .replace(MDX_EXTENSION, '')
  }
  getSlugFromFilePath(path: string, post: Pick<Post, 'date' | 'legacy'>) {
    const date = new Date(post.date)
    const isLegacy = post.legacy
    const slug = path
      .replace(/(\d{1,2})_/gi, `${date.getMonth() + 1}/`)
      .replace(MDX_EXTENSION, '')
    if (isLegacy) {
      return slug.replace(CONTENT_ROOT, '').replace(/^[/]?\w+\//, 'blog/')
    }
    return slug.replace(CONTENT_ROOT, 'blog')
  }

  getSlugFromPostInfo(post: Post) {
    const date = new Date(post.date)

    return `blog/${date.getFullYear()}/${date.getMonth() + 1}/${post.slug}`
  }
}

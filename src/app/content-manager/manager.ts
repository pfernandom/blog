import { CONTENT_PATH } from 'blog_constants'
import fs from 'fs'
import path from 'path'
import parseMDX from './helpers/parse_mdx'
import UrlManager from './url-manager'
import { Post } from 'app/models/interfaces'
export type { Post } from 'app/models/interfaces'

export type Slug = string

export type Markdown = string

export interface FileInfo {
  fileName: string
  filePath: string
  dirPath: string
  subblogPath?: string
}

export interface SubBlog {
  path: string
  basename: string
  metadata: {
    title: string
    description: string
  }
}

export interface PostInfo {
  slug: Slug
  postPath: string
  frontmatter: Post
  content?: Markdown
}

interface ContentManager {
  fetchAll(): Promise<PostInfo[]>
  fetchAllSync(): PostInfo[]
  fetch(slug: string): Promise<PostInfo | undefined>
}

export class LocalContentManager implements ContentManager {
  contentPath: string

  contentDir: string

  urlManager: UrlManager

  constructor() {
    this.contentPath = CONTENT_PATH
    // this.contentDir = path.basename(contentPath)
    this.contentDir = 'app/content/software'

    this.urlManager = new UrlManager()
  }
  fetchAllSync(): PostInfo[] {
    const slugs = getAllFiles(this.contentPath, /.mdx?$/gi, [])

    const isProd = process.env.NODE_ENV === 'production'

    const posts: Array<PostInfo> = slugs
      .map((slug) => this.#fetchFromSubBlogAndFileInfo(slug))
      .filter((post) => post != null)
      .filter((post) => !(isProd && post?.frontmatter.test == true))
      .map((post) => post as PostInfo)

    posts.sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
    return posts
  }

  findSubBlogs(): SubBlog[] {
    const files = fs.readdirSync(this.contentPath)
    return files
      .map((file) => ({ filePath: this.contentPath + '/' + file, slug: file }))
      .filter(
        ({ filePath }) =>
          fs.statSync(filePath).isDirectory() &&
          fs.existsSync(`${filePath}/metadata.json`)
      )
      .map(({ filePath, slug }) => ({
        slug,
        path: filePath,
        basename: this.contentPath,
        metadata: JSON.parse(
          fs.readFileSync(`${filePath}/metadata.json`, 'utf8')
        ),
      }))
  }

  fetch(): Promise<PostInfo | undefined> {
    throw new Error('Method not implemented.')
  }

  #fetchFromSubBlogAndFileInfo(filePath: FileInfo) {
    const fileContents = fs.readFileSync(filePath.filePath, 'utf8')

    const imagesPath = this.urlManager.getImagesDir(filePath.dirPath)

    const { postData: post, content } = parseMDX({
      fileContents,
      imagesPath,
    })

    if (!post.published) {
      return null
    }

    const subblog_slug = this.urlManager.getSubBlogName(filePath.filePath)
    post.subblog_slug = subblog_slug

    const slug = this.urlManager.getSlugFromFilePath(filePath.filePath, post)

    return {
      slug,
      postPath: filePath.filePath,
      frontmatter: post,
      content,
    }
  }

  async fetchAll(): Promise<PostInfo[]> {
    const slugs = getAllFiles(this.contentPath, /.mdx?$/gi, [])

    const isProd = process.env.NODE_ENV === 'production'

    const posts: Array<PostInfo> = slugs
      .map((slug) => this.#fetchFromSubBlogAndFileInfo(slug))
      .filter((post) => post != null)
      .filter((post) => !(isProd && post?.frontmatter.test == true))
      .map((post) => post as PostInfo)

    posts.sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
    return posts
  }
}

const getAllFiles = function (
  dirPath: string,
  pattern: string | RegExp,
  arrayOfFiles: Array<FileInfo> | undefined = [],
  relativeToPath = '.'
): FileInfo[] {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    const regex = RegExp(pattern, 'ig')
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(
        dirPath + '/' + file,
        pattern,
        arrayOfFiles,
        relativeToPath
      )
    } else if (regex.test(file)) {
      const relativePath = path.relative(
        relativeToPath,
        path.join(dirPath, '/')
      )
      arrayOfFiles.push({
        fileName: file,
        filePath: [relativePath, '/', file].join(''),
        dirPath: relativePath,
      })
    }
  })

  return arrayOfFiles
}

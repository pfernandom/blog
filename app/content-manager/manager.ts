import { format, parseISO } from 'date-fns'
import fs from 'fs'
import matter from 'gray-matter'
import path, { join } from 'path'

export type Slug = string

export type Markdown = string

export interface FileInfo {
  fileName: string
  filePath: string
  dirPath: string
  subblogPath?: string
}

export interface Post {
  title: string
  date: string
  description: Array<string>
  key_words: Array<string>
  hero_image: string
  hero_image_original?: string
  hero_image_blur: string
  hero_image_alt: string
  hero_width: number
  hero_height: number
  published: boolean
  series: string | null
  social_title: string
  social_subtitle: string
  social_footer: string
  test: boolean
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
  fetchAll(subblog: SubBlog): Promise<PostInfo[]>
  fetch(slug: string): Promise<PostInfo | undefined>
}

export class LocalContentManager implements ContentManager {
  contentPath: string

  contentDir: string

  imagesPath: string

  constructor(contentPath: string) {
    this.contentPath = contentPath
    // this.contentDir = path.basename(contentPath)
    this.contentDir = 'app/content/software'
    this.imagesPath = join('/opt_images/', contentPath)
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

  fetch(slug: string): Promise<PostInfo | undefined> {
    throw new Error('Method not implemented.')
  }

  #fetchFromFileInfo(subblog: SubBlog, filePath: FileInfo) {
    const fileContents = fs.readFileSync(filePath.filePath, 'utf8')

    const { data, content } = matter(fileContents)

    if (!data.published) {
      return null
    }

    const date = format(parseISO(data.date), 'MMMM dd, yyyy')
    const {
      title,
      description,
      hero_image: relativeHero,
      hero_image_alt,
      hero_width,
      hero_height,
      published,
      key_words,
      series,
      social_title,
      social_subtitle,
      social_footer,
      test,
    } = data

    const hero_image = relativeHero
      ? path.join(
          this.imagesPath,
          relativeHero.replace(/(png|jpg|jpeg|gif)/gi, 'webp')
        )
      : ''
    const hero_image_blur = relativeHero
      ? path.join(
          this.imagesPath,
          'blur_' +
            relativeHero?.slice(2).replace(/(png|jpg|jpeg|gif)/gi, 'webp')
        )
      : ''

    const hero_image_original = relativeHero
      ? path.join(this.imagesPath, relativeHero)
      : ''

    const frontmatter: Post = {
      title,
      description,
      hero_image,
      hero_image_blur,
      hero_image_original,
      hero_image_alt: hero_image_alt ?? '',
      ...(hero_width && { hero_width }),
      ...(hero_height && { hero_height }),
      date,
      key_words: parseKeyWords(key_words),
      series: series ?? null,
      published,
      social_title: social_title ?? title,
      social_subtitle: social_subtitle ?? description[0],
      social_footer:
        social_footer ?? 'Visit pedromarquez.dev for the full post',
      test: test ?? false,
    }
    const slug = slugToPage(filePath.filePath, new Date(frontmatter.date))
    console.log({ slug })
    return {
      // TODO: Move somewhere else
      slug: slug
        ?.replace(`app/content/software/`, 'blog/')
        ?.replace('/index.mdx', ''),
      postPath: filePath.filePath,
      frontmatter,
      content: content
        .replace(/\]\(.\//g, `](${filePath.filePath}/`)
        .replace(/.gif/g, '.webp'),
    }
  }

  async fetchAll(subblog: SubBlog): Promise<PostInfo[]> {
    const slugs = getAllFiles(this.contentPath, /.mdx?$/gi, [])

    const isProd = process.env.NODE_ENV === 'production'

    const posts: Array<PostInfo> = slugs
      .map((slug) => this.#fetchFromFileInfo(subblog, slug))
      .filter((post) => post != null)
      .filter((post) => {
        if (isProd && post?.frontmatter.test == true) {
          return false
        }
        return true
      })
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
  relativeToPath = '.',
  isRoot = true
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
        relativeToPath,
        false
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

export function slugToPage(path: string, date: Date) {
  const slug = path.replace(/(\d{1,2})_/gi, `${date.getMonth() + 1}/`)
  return slug
}

function parseKeyWords(keywords: string | string[]) {
  if (Array.isArray(keywords)) {
    return keywords.map((keyword) => keyword.trim())
  }
  return (
    keywords
      ?.split(',')
      .map((el) => el.trim())
      .filter((keyword) => keyword.length) ?? []
  )
}

import matter from 'gray-matter'
import { parseISO, format } from 'date-fns'
import fs from 'fs'
import path from 'path'
import { join } from 'path'
import { Post, PostInfo } from '../models/interfaces'
import { slugToPage } from './slug-management'
import { CONTENT_PATH } from 'blog_constants'

type FileInfo = {
  fileName: string
  filePath: string
  dirPath: string
}

const getAllFiles = function (
  dirPath: string,
  pattern: string | RegExp,
  arrayOfFiles: Array<FileInfo> | undefined = [],
  relativeToPath: string
) {
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

export function getPostByFileInfo(slugFile: FileInfo): PostInfo | null {
  const curDirRelative = join(process.cwd(), 'src', 'app')

  const postFileLocation = slugFile.filePath
  const postDirPath = slugFile?.dirPath

  const fileContents = fs.readFileSync(
    join(curDirRelative, postFileLocation),
    'utf8'
  )

  const { data, content } = matter(fileContents)

  const publicPath = join('/opt_images/', postDirPath)
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
        publicPath,
        relativeHero.replace(/(png|jpg|jpeg|gif)/gi, 'webp')
      )
    : ''
  const hero_image_blur = relativeHero
    ? path.join(
        publicPath,
        'blur_' + relativeHero?.slice(2).replace(/(png|jpg|jpeg|gif)/gi, 'webp')
      )
    : ''

  const hero_image_original = relativeHero
    ? path.join(publicPath, relativeHero)
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
    social_footer: social_footer ?? 'Visit pedromarquez.dev for the full post',
    test: test ?? false,
  }

  return {
    slug: slugToPage(
      slugFile?.dirPath.replace('content/software/', 'blog/'),
      new Date(frontmatter.date)
    ),
    postPath: slugFile?.dirPath,
    frontmatter,
    content: content
      .replace(/\]\(.\//g, `](${publicPath}/`)
      .replace(/.gif/g, '.webp'),
  }
}

export function getAllPosts() {
  const curDir = join(CONTENT_PATH, 'software')
  const curDirRelative = join(process.cwd(), 'src', 'app')
  const slugs = getAllFiles(curDir, /.mdx?$/gi, [], curDirRelative)

  const isProd = process.env.NODE_ENV === 'production'

  const posts: Array<PostInfo> = slugs
    .map((slug) => getPostByFileInfo(slug))
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

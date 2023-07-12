import { format, parseISO } from 'date-fns'
import matter from 'gray-matter'
import { Post } from '../manager'
import path from 'path'

export type MDXContent = string

export interface ParsedMDX {
  postData: Post
  content: MDXContent
}

export default function parseMDX({
  fileContents,
  imagesPath,
}: {
  fileContents: string
  imagesPath: string
}): ParsedMDX {
  const { data, content } = matter(fileContents)

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
    legacy,
  } = data

  const hero_image = relativeHero
    ? path.join(
        imagesPath,
        relativeHero.replace(/(png|jpg|jpeg|gif)/gi, 'webp')
      )
    : ''
  const hero_image_blur = relativeHero
    ? path.join(
        imagesPath,
        'blur_' + relativeHero?.slice(2).replace(/(png|jpg|jpeg|gif)/gi, 'webp')
      )
    : ''

  const hero_image_original = relativeHero
    ? path.join(imagesPath, relativeHero)
    : ''

  return {
    postData: {
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
      legacy: legacy ?? false,
    },
    content: content
      .replace(/\]\(.\//g, `](${imagesPath}/`)
      .replace(/.gif/g, '.webp'),
  }
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

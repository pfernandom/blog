import { Post } from '../manager'
import { format, parseISO } from 'date-fns'
import UrlManager from '../url-manager'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validatePostData(data: { [key: string]: any }): Post {
  const {
    slug,
    title,
    date,
    description,
    key_words,
    hero_image,
    hero_image_original,
    hero_image_blur,
    hero_image_alt,
    hero_width,
    hero_height,
    published,
    series,
    social_title,
    social_subtitle,
    social_footer,
    test,
    legacy,
    subblog_slug,
  } = data

  const postData = {
    slug,
    title,
    date: format(parseISO(date), 'MMMM dd, yyyy'),
    description,
    key_words,
    hero_image,
    hero_image_original,
    hero_image_blur,
    hero_image_alt,
    hero_width,
    hero_height,
    published,
    series,
    social_title,
    social_subtitle,
    social_footer,
    test,
    legacy,
    subblog_slug,
  }

  const urlManager = new UrlManager()
  const fullSlug = urlManager.getSlugFromPostInfo(postData)
  postData.slug = fullSlug

  return postData
}

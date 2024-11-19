import { Post } from 'app/models/interfaces'
import { Metadata } from 'next'

export async function getBlogPostSEO(
  post: Post,
  seoImages: string[],
  pageLinks: { next: string | null; prev: string | null }
): Promise<Metadata> {
  const BLOG_POST_IMG_WIDTH = 440
  const BLOG_POST_IMG_HEIGHT = 220

  const { title, description, date, hero_image_alt, key_words } = post
  const url = 'https://pfernandom.github.io'

  const imageList = seoImages.map((image) => ({
    url: image,
    width: BLOG_POST_IMG_WIDTH,
    height: BLOG_POST_IMG_HEIGHT,
    alt: hero_image_alt,
  }))

  const other: { prev?: string; next?: string } = {}
  if (pageLinks.prev) {
    other['prev'] = pageLinks.prev
  }
  if (pageLinks.next) {
    other['next'] = pageLinks.next
  }

  return {
    metadataBase: new URL('https://pedromarquez.dev'),
    title: '',
    description: '',
    applicationName: '',
    authors: { name: 'Pedro Marquez-Soto' },
    keywords: key_words,
    // alternates:[],
    openGraph: {
      title,
      description: Array.isArray(description)
        ? description.join('. ')
        : description,
      url,
      type: 'article',
      images: imageList,
      publishedTime: date,
      modifiedTime: date,
      // expirationTime?: string;
      // authors?: null | string | URL | Array<string | URL>;
      // section?: null | string;
      section: 'Section II',
      tags: key_words,
    },
    twitter: {
      creator: '@pfernandom',
      site: '@site',
      card: 'summary_large_image',
    },
    other,
  }
}

import { Post } from 'app/types/jsonschema'
import { InstagramPost } from './InstagramPost'
export { type Post } from 'app/types/jsonschema'

export interface RGBColor {
  a?: number | undefined
  b: number
  g: number
  r: number
}

export interface PostInfo {
  slug: string
  postPath: string
  frontmatter: Post
  content?: string
}

export interface Metadata {
  title: string
  description: string
  author: string
}

export type InstagramLinkParams = {
  metadata: Metadata
  blog: Array<string>
  post: PostInfo
  posts: PostInfo[]
  host: string
  isProd: boolean
  instagramPostConfig: InstagramPost
}

export interface CanvasFont {
  color: string | RGBColor
  size?: string | number
  family: string
  lineHeight?: number

  toString(): string
}

export interface InstagramPostType {
  slug?: string
  width?: number
  height?: number
  fontSize?: number | string
  fonts?: Record<string, CanvasFont>
}

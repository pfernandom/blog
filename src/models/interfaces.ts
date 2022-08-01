import { RGBColor } from "react-color";
import { InstagramPost } from "./InstagramPost";

export interface Post {
  title: string;
  date: string;
  description: Array<string>;
  key_words: Array<string>;
  hero_image: string;
  hero_image_blur: string;
  hero_image_alt: string;
  published: boolean;
  social_title: string;
  social_subtitle: string;
  social_footer: string;
}

export interface PostInfo {
  slug: string;
  frontmatter: Post;
  content?: string;
}

export interface Metadata {
  title: string;
  description: string;
  author: string;
}

export type InstagramLinkParams = {
  metadata: Metadata;
  blog: Array<string>;
  post: PostInfo;
  posts: PostInfo[];
  host: string;
  isProd: boolean;
  instagramPostConfig: InstagramPost;
};

export interface CanvasFont {
  color: string | RGBColor;
  size?: string | number;
  family: string;
  lineHeight?: number;

  toString(): string;
}

export interface InstagramPostType {
  slug?: string;
  width?: number;
  height?: number;
  fontSize?: number | string;
  fonts?: Record<string, CanvasFont>;
}

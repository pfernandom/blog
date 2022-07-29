export interface Post {
  title: string;
  date: string;
  description: Array<string>;
  hero_image: string;
  hero_image_blur: string;
  hero_image_alt: string;
  published: boolean;
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

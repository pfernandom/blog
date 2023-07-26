import { globSync } from 'glob'
import fs from 'node:fs'
import path from 'path'
// import { reactPlugin, reactOutputPlugin } from './unified'
import { fromFrontMatter } from './unified/frontmatter'
import { parseMarkdown } from './unified/parse'
// import type {IntrinsicElements} from 'react'

export class StaticContentManager {
  getStaticPosts() {
    return globSync(path.join('content/**/*.md'))
      .map((p) => ({ path: p, content: fs.readFileSync(p, 'utf8') }))
      .map(({ path, content }) => ({
        path,
        content,
        data: fromFrontMatter(content),
      }))
      .map(({ path, data, content }) => ({
        data,
        content: parseMarkdown(path, content),
      }))
  }

  getStaticPostsPaths() {
    const isProd = process.env.NODE_ENV === 'production'
    return globSync(path.join('content/**/*.md'))
      .map((p) => ({ path: p, content: fs.readFileSync(p, 'utf8') }))
      .map(({ path, content }) => ({ path, content: fromFrontMatter(content) }))
      .filter(({ content }) => !isProd || content.test !== true)
  }
}

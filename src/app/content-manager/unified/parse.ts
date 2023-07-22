import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
// import { reactPlugin, reactOutputPlugin } from './unified'
import rehypeReact from 'rehype-react'
import { buildOptions } from './config'
import { preprocessPlugin } from './preprocess'
// import type {IntrinsicElements} from 'react'

import rehypeInlineCodeClassNamePlugin from 'rehype-inline-code-classname'
import rePrism from './re-prism'
import remarkGfm from 'remark-gfm'

export function parseMarkdown(path: string, content: string) {
  return unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(remarkGfm)
    .use(rehypeInlineCodeClassNamePlugin)
    .use(rePrism)
    .use(preprocessPlugin, { contentPath: path })
    .use(rehypeReact, buildOptions())
    .processSync(content).result
}

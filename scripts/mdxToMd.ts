import fs from 'fs'
import path, { join } from 'path'
import { globSync } from 'glob'
import { JSDOM } from 'jsdom'
import matter from 'gray-matter'
import { stringify } from 'yaml'

import { NodeHtmlMarkdown } from 'node-html-markdown'

const postsDirectory = join(process.cwd(), 'out', 'blog')
const originalMdx = join(process.cwd(), 'src', 'app', 'content', 'software')

async function main() {
  const slugs = globSync(join(postsDirectory, '**/*.html'))
  const mdx = globSync(join(originalMdx, '**/*.mdx')).reduce(
    (acc, el) => ({
      [el
        .replace(originalMdx, postsDirectory)
        .replace(/\d{4}\//, '')
        .replace(/\d{1,2}_([\w-\d]+)\/index.mdx/, '$1.html')]: el,
      ...acc,
    }),
    {} as Record<string, string>
  )
  console.log({ slugs })

  slugs.map(async (p) => {
    const html = fs.readFileSync(p, { encoding: 'utf-8' })
    const originalMDX = mdx[p.replace(/\d{4}\/\d{1,2}\//, '')]

    const htmlToMarkdown = new NodeHtmlMarkdown()

    const body = new JSDOM(html)

    const outpath = path.join(process.cwd(), 'puremd')

    const markdown = htmlToMarkdown.translate(
      body.window.document.querySelector('[data-test-blog-content]')
        ?.innerHTML ?? ''
    )

    const frontMatter = fs.existsSync(originalMDX)
      ? matter(fs.readFileSync(originalMDX, 'utf8')).data
      : { slug: 'NA' }

    fs.mkdirSync(outpath, { recursive: true })
    fs.writeFileSync(
      path.join(outpath, path.basename(p) + '.md'),
      `---\n${stringify(frontMatter)}---\n\n${markdown}`
    )
  })
}

main()

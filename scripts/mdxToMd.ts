import fs from 'fs'
import path, { join } from 'path'

import { NodeHtmlMarkdown } from 'node-html-markdown'
import { getAllFiles } from './common'

const postsDirectory = join(process.cwd(), 'out', 'blog')

async function main() {
  const regexExt = /\.(html)$/gi

  const slugs = getAllFiles(postsDirectory, regexExt, []).map((f) =>
    join(postsDirectory, f.filePath)
  )
  console.log({ slugs })

  slugs.map(async (p) => {
    const html = fs.readFileSync(p, { encoding: 'utf-8' })

    const htmlToMarkdown = new NodeHtmlMarkdown()

    const outpath = path.join(process.cwd(), 'puremd')

    const markdown = htmlToMarkdown.translate(html)

    fs.mkdirSync(outpath, { recursive: true })
    fs.writeFileSync(path.join(outpath, path.basename(p) + '.md'), markdown)
  })
}

main()

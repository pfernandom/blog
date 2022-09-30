import fs from 'fs'
import path, { join } from 'path'

import prettier from 'prettier'
import { getAllFiles, postsDirectory, getPostByFileInfo } from './common'

const getDate = new Date().toISOString()

const YOUR_AWESOME_DOMAIN = 'https://pedromarquez.dev'

const formatted = (sitemap: string) =>
  prettier.format(sitemap, { parser: 'html' })

;(async () => {
  const regexExt = /\.(tsx|mdx)$/gi

  const slugs = getAllFiles(postsDirectory, regexExt, [])

  const pages = slugs
    .filter((slug) => getPostByFileInfo(slug) != null)
    .map((f) => join('blog', f.filePath.replace('/index.mdx', '')))

  console.log({ pages })

  const fileP = join(process.cwd(), 'src', 'sw', 'files.ts')

  fs.writeFileSync(
    fileP,
    `console.log("${getDate}"); \nconst pages = ${JSON.stringify(
      pages,
      null,
      4
    )}; export default pages;`,
    'utf8'
  )
})()

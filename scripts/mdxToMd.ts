import mdx from '@mdx-js/esbuild'
import esbuild from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'
import fs from 'fs'
import path, { join } from 'path'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

import { getAllFiles } from './common'
import { NodeHtmlMarkdown } from 'node-html-markdown'

const postsDirectory = join(process.cwd(), 'out', 'blog')

// async function main2() {
//   const regexExt = /\.(mdx)$/gi

//   const slugs = getAllFiles(postsDirectory, regexExt, [])
//   console.log({ slugs })

//   //   const mds = pages.map((page) => {
//   //     console.log(join(postsDirectory, page.filePath))
//   //     return mdxToMd(join(postsDirectory, page.filePath), {
//   //       cwd: postsDirectory,
//   //       compileOptions: { useDynamicImport: true },
//   //     })
//   //   })

//   slugs.map(async (f) => {
//     const p = f.filePath
//     const outPath = path.join(process.cwd(), 'puremd', f.dirPath)
//     fs.mkdirSync(outPath, { recursive: true })
//     const outFile = path.join(outPath, 'output.mjs')
//     const esb = await esbuild.build({
//       entryPoints: [p],
//       bundle: true,
//       outfile: outFile,
//       platform: 'node',
//       format: 'esm',
//       jsx: 'automatic',
//       mainFields: ['module', 'main'],
//       inject: [path.join(process.cwd(), 'scripts', 'inject.js')],
//       tsconfig: path.join(process.cwd(), 'tsconfig-dev.json'),
//       loader: {
//         '.gif': 'dataurl',
//         '.png': 'dataurl',
//         '.jpg': 'dataurl',
//         '.jpeg': 'dataurl',
//       },
//       plugins: [
//         nodeExternalsPlugin({
//           allowList: ['next/image', 'next/document', 'next/script', 'react'],
//         }),
//         mdx({
//           remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
//           /* Options… */
//           // outputFormat: 'function-body',
//           // useDynamicImport: true,
//         }),
//       ],
//     })

//     console.log({ esb })
//     try {
//       // const output = await import(outFile)
//       console.log({ output: output.default })

//       const html = renderToString(output.default())
//       const html2 = renderToStaticMarkup(output.default())

//       const htmlToMarkdown = new NodeHtmlMarkdown()

//       // console.log({ html })
//       // console.log({ html2 })
//       const markdown = htmlToMarkdown.translate(html)

//       // console.log({ markdown })

//       fs.writeFileSync(path.join(outPath, path.basename(p) + '.md'), markdown)
//       fs.rmSync(outFile)
//     } catch (err) {
//       console.error('Error loading: ' + outFile)
//       console.error(err)
//     }
//   })
//   //   const result = await Promise.all(mds)

//   //   console.log({ result })
// }

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

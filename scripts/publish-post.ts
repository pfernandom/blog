import path, { join } from 'path'
import readline from 'readline'
import matter from 'gray-matter'
import fs from 'fs'

const base_post = join(process.cwd(), 'src', 'blog', '1988')
const posts_dir = join(process.cwd(), 'src', 'blog')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function getAllFiles(dirPath: string, slug: string, arrayOfFiles: string[]) {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, slug, arrayOfFiles)
    } else {
      if (
        join(__dirname, dirPath, '/', file).includes(slug) &&
        file.includes('index.mdx')
      ) {
        arrayOfFiles.push(join(__dirname, dirPath, '/', file))
      }
    }
  })

  return arrayOfFiles
}

function publish(slugIn: string) {
  const slug = slugIn.replace('_', '-')
  const currentYear = new Date().toLocaleDateString('en-us', {
    year: 'numeric',
  })

  const dir: string[] = []
  getAllFiles(posts_dir, slug, dir)

  const matchingSlugs = dir.filter((el) => el.includes(slug))

  console.log(matchingSlugs)
  for (const mslug of matchingSlugs) {
    rl.question(`Publish ${mslug}? (y/n)`, function (isMatch) {
      if (isMatch.includes('y')) {
        console.log(`Publishing ${mslug}`)
        rl.close()
      }
      rl.pause()
    })
  }
}

rl.question('What is the post`s slug? ', function (slug) {
  publish(slug)
})

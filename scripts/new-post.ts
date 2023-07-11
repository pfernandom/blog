import path, { join } from 'path'
import readline from 'readline'
import matter from 'gray-matter'
import fs from 'fs'

const base_post = join(process.cwd(), 'src', 'blog', '1988')
const posts_dir = join(process.cwd(), 'src', 'blog')

function create(
  title: string,
  descriptionIn: string,
  keywords: string,
  slugIn: string
) {
  const slug = slugIn.replace('_', '-')
  const description = descriptionIn.split('.')
  const contents = matter.stringify(
    `import Image from 'app/_components/image'
    
    Welcome
    `,
    {
      title,
      date: new Date().toLocaleDateString('fr-CA', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }),
      description,
      hero_image: './hero.png',
      hero_image_alt: 'A hero image for this post',
      key_words: keywords.split(','),
      published: true,
      test: true,
    }
  )
  console.log(contents)

  const currentYear = new Date().toLocaleDateString('en-us', {
    year: 'numeric',
  })

  const dir = fs.readdirSync(join(posts_dir, currentYear))

  const posts = dir.map((el) => [parseInt(el.split('_')[0]), el])
  posts.sort((a, b) => {
    const ai: number = a[0] as number
    const bi: number = b[0] as number
    return ai - bi
  })

  const matchingSlugs = dir
    .flatMap((el) => el.split('_'))
    .filter((el) => el.includes(slug))

  if (matchingSlugs.length > 0) {
    console.log('Post with that slug already exists!')
    return
  }

  const last_post_index: number = posts[posts.length - 1][0] as number
  const newSlug = `${last_post_index + 1}_${slug}`
  console.log(`${last_post_index + 1}_${slug}`)
  const newPostDir = join(posts_dir, currentYear, newSlug)

  fs.mkdirSync(newPostDir, {
    recursive: true,
  })

  fs.writeFileSync(join(newPostDir, 'index.mdx'), contents)
  fs.copyFileSync(
    join(base_post, '0_test_post', 'hero.jpeg'),
    join(newPostDir, 'hero.jpeg')
  )
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('What is the post`s name? ', function (title) {
  rl.question('What is the post`s description? ', function (description) {
    rl.question('What are the post`s keywords? ', function (keywords) {
      rl.question('What is the post`s slug? ', function (slug) {
        create(title, description, keywords, slug)
        rl.close()
      })
    })
  })
})

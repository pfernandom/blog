import { Feed } from 'feed'
import fs from 'fs'
import { Metadata } from '../app/models/interfaces'
import { getDataFile } from '../app/helpers/data-fetchers'
import { getAllPosts } from '../app/helpers/page-fetcher'

const generateRssFeed = async () => {
  const posts = await getAllPosts()
  const metadata: Metadata = await getDataFile('app/data/metadata.json')
  const siteURL = 'https://pedromarquez.dev'
  const date = new Date()
  const author = {
    name: metadata.author,
    email: 'pfernandom@gmail.com',
    link: 'https://twitter.com/pfernandom',
  }
  const feed = new Feed({
    title: metadata.title,
    description: metadata.description,
    id: siteURL ?? '',
    link: siteURL,
    image: `${siteURL}/logo.svg`,
    favicon: `${siteURL}/favicon.png`,
    copyright: `All rights reserved ${date.getFullYear()}`,
    updated: date,
    generator: 'Feed for Node.js',
    feedLinks: {
      rss2: `${siteURL}/rss/feed.xml`,
      json: `${siteURL}/rss/feed.json`,
      atom: `${siteURL}/rss/atom.xml`,
    },
    author,
  })
  posts
    .filter((post) => post.frontmatter.published)
    .forEach((post) => {
      const url = `${siteURL}/${post.slug}`
      feed.addItem({
        title: post.frontmatter.title,
        id: url,
        link: url,
        description: post.frontmatter.description.join('. '),
        content: post.frontmatter.description.join('. '),
        author: [author],
        contributor: [author],
        date: new Date(post.frontmatter.date),
        enclosure: {
          url: `${siteURL}${post.frontmatter.hero_image}`,
        },
      })
    })

  fs.mkdirSync('./public/rss', { recursive: true })
  fs.writeFileSync('./public/rss/feed.xml', feed.rss2())
  fs.writeFileSync('./public/rss/atom.xml', feed.atom1())
  fs.writeFileSync('./public/rss/feed.json', feed.json1())
}

generateRssFeed()

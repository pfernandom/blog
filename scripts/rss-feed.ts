import { Feed } from 'feed'
import fs from 'fs'
import { Metadata } from 'app/models/interfaces'
import { getDataFile } from 'app/helpers/data-fetchers'
import { getAllPosts } from 'app/helpers/page-fetcher'

const generateRssFeed = async () => {
  const posts = getAllPosts()
  const metadata: Metadata = await getDataFile('src/app/_data/metadata.json')
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
      let description = post.frontmatter.description
      description =
        typeof description === 'string' ? description : description.join('. ')
      feed.addItem({
        title: post.frontmatter.title,
        id: url,
        link: url,
        description,
        content: description,
        author: [author],
        contributor: [author],
        date: new Date(post.frontmatter.date),
        enclosure: {
          url: `${siteURL}${post.frontmatter.hero_image}`,
        },
      })
    })

  const activityPubNotes = posts
    .filter((post) => post.frontmatter.published)
    .map((post) => {
      const url = `${siteURL}/${post.slug}`
      let description = post.frontmatter.description
      description =
        typeof description === 'string' ? description : description.join('. ')

      const content = `<h1>${post.frontmatter.title}<h1> <p>${description}</p> <p>Full content <a href="${url}">here</a>`

      const noteId = post.slug.split('/').join('_')

      return {
        noteId,
        note: {
          '@context': 'https://www.w3.org/ns/activitystreams',
          id: `https://pedromarquez.dev/socialweb/notes/${noteId}`,
          type: 'Note',
          attributedTo: 'https://pedromarquez.dev/@blog',
          published: new Date(post.frontmatter.date).toISOString(),
          content,
          to: ['https://www.w3.org/ns/activitystreams#Public'],
        },
      }
    })

  activityPubNotes.forEach((note) => {
    fs.mkdirSync(`./public/socialweb/notes/`, { recursive: true })

    fs.writeFileSync(
      `./public/socialweb/notes/${note.noteId}`,
      JSON.stringify(note.note, null, 2)
    )
  })

  fs.writeFileSync(
    `./public/socialweb/outbox`,
    JSON.stringify(
      {
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: 'https://pedromarquez.dev/socialweb/outbox',
        type: 'OrderedCollection',
        summary: 'A blog about all things coding I like',
        totalItems: activityPubNotes.length,
        orderedItems: activityPubNotes.map((note) => note.note),
      },
      null,
      2
    )
  )
}

generateRssFeed()

require('dotenv').config()
const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                published
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges

    function getPrevious(index) {
      let previous = {
        published: false
      };

      let i = index + 1;
      while (previous && !previous.frontmatter?.published) {
        previous = i >= posts.length ? null : posts[i].node
        i += 1;
      }

      return previous
    }

    function getNext(index) {
      let next = {
        frontmatter: {
          published: false
        }

      };

      let i = index - 1;
      while (next && !next.frontmatter?.published) {
        next = i < 0 ? null : posts[i].node
        i -= 1;
      }
      return next;
    }


    posts.forEach((post, index) => {
      const previous = getPrevious(index)
      const next = getNext(index)

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    return null
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

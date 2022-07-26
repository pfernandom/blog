import React from 'react';
import { Link, graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { rhythm } from '../utils/typography';
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

function blogIndex({ data, location }) {
  const siteTitle = data.site.siteMetadata.title;
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" keywords={[`blog`, `gatsby`, `javascript`, `react`]} />
      <Bio />
      {posts
        .filter(({ node }) => node.frontmatter.published)
        .map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug;
          const image = getImage(node.frontmatter.hero_image)

          return (
            <div key={node.fields.slug} style={{
              display: `flex`,
              marginBottom: rhythm(2.5),
            }}
              data-key={node.fields.slug}>
              {node.frontmatter.hero_image && (
                <Link style={{ display: `contents` }} className="circle-image" to={node.fields.slug}>
                  <GatsbyImage
                    image={image}
                    imgClassName="circle-image"
                    alt={node.frontmatter.hero_image_alt}
                    style={{

                      marginRight: rhythm(1 / 2),
                      marginBottom: 0,
                      maxWidth: 70,
                      maxHeight: 70,
                      borderRadius: `100%`,
                      marginTop: rhythm(1 / 2),
                    }}
                    imgStyle={{
                      borderRadius: `50%`,
                    }}
                  />
                </Link>
              )}
              <div>
                <h3
                  style={{
                    marginBottom: rhythm(1 / 4),
                    marginTop: rhythm(1 / 8),
                  }}
                >
                  <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                    {title}
                  </Link>
                </h3>
                <small>{node.frontmatter.date}</small>
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                />
              </div>
            </div>
          );
        })}
    </Layout>
  );
}

export default blogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            published
            hero_image_alt
            hero_image {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
      }
    }
  }
`;

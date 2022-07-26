/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"
import { SocialIcon } from 'react-social-icons';


import { rhythm } from "../utils/typography"

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <div
            style={{
              marginBottom: rhythm(2.5),
            }}
          >
            <div
              style={{
                display: `flex`,
              }}
            >
              <Image
                fixed={data.avatar.childImageSharp.fixed}
                alt={author}
                style={{
                  marginRight: rhythm(1 / 2),
                  marginBottom: 0,
                  minWidth: 50,
                  borderRadius: `100%`,
                }}
                imgStyle={{
                  borderRadius: `50%`,
                }}
              />
              <p>
                Written by <strong>{author}</strong> who lives and works in Austin, Texas, doing all things front-end (and some back-end too).
              </p>
            </div>
            <div style={{ position: 'fixed', top: '1em', right: '1em', display: 'flex', flexDirection: 'column' }}>
              <SocialIcon url="https://www.instagram.com/pedro.marquez.soto/" style={{ marginBottom: '10px' }} />
              <SocialIcon url="https://www.linkedin.com/in/pedro-fernando-m%C3%A1rquez-soto-1218a345/" style={{ marginBottom: '10px' }} />
              <SocialIcon url="https://medium.com/@pfernandom" />

            </div>
          </div >
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`

export default Bio

import React, { MouseEventHandler, useState } from 'react'
import {
  SocialIcon,
  SocialIconDatabase,
} from 'react-social-icons/build/react-social-icons-lite'
import facebook from 'react-social-icons/build/networks/facebook'
import twitter from 'react-social-icons/build/networks/twitter'
import reddit from 'react-social-icons/build/networks/reddit'
import linkedin from 'react-social-icons/build/networks/linkedin'
import share from 'react-social-icons/build/networks/sharethis'

import useMediaQuery from 'src/helpers/use-media-query'

SocialIconDatabase.importNetworks([facebook, twitter, reddit, linkedin, share])

type ShareButtonsProps = {
  url: string
  title: string
  author: string
  description: string
  username?: string
}

function IconButton({
  className,
  style,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`${className} social-icon share-btn`}
      style={{
        borderRadius: '3em',
        border: 'none',
        backgroundColor: 'transparent',
        ...style,
      }}
    >
      <svg
        className="social-svg"
        style={{ width: '50px', height: '50px', borderRadius: '3em' }}
        viewBox="0 0 64 64"
      >
        <g className="social-svg-mask">
          <path d={share.mask} style={{ fill: share.color }} />
        </g>
        <g className="social-svg-icon" style={{ fill: 'white' }}>
          <path d={share.icon} />
        </g>
      </svg>
    </button>
  )
}

function ShareLink({
  className,
  href,
  children,
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <SocialIcon
      label={`Share this article to ${className}`}
      className="share-btn"
      fgColor="white"
      url={href}
      style={{ scale: 0.5 }}
      target="_blank"
      rel="noreferrer"
    />
  )
}

export default function ShareButtons({
  url,
  title,
  author,
  description,
  username = 'pfernandom',
}: ShareButtonsProps) {
  const [isExpanded, setExpanded] = useState(false)

  function share() {
    if (navigator.share) {
      navigator
        .share({
          title,
          text: description,
          url,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error))
    } else {
      console.log('Share not supported on this browser, do it the old way.')
    }
  }

  return (
    <div className={`share-buttons`}>
      {/* Basic Share Links */}
      <IconButton
        aria-label="Expand share buttons"
        className="expand-button"
        onClick={() => {
          setExpanded(!isExpanded)
        }}
      ></IconButton>

      {isExpanded && (
        <div className="share-buttons--expanded">
          {/* Twitter (url, text, @mention) */}
          <ShareLink
            className="twitter"
            href={`https://twitter.com/share?url=${url}&text=${title}&via=${username}`}
          >
            Twitter
          </ShareLink>
          {/* Facebook (url) */}
          <ShareLink
            className="facebook"
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          >
            Facebook
          </ShareLink>
          {/* Reddit (url, title) */}
          <ShareLink
            className="reddit"
            href={`https://reddit.com/submit?url=${url}&title=${title}`}
          >
            Reddit
          </ShareLink>
          {/* LinkedIn (url, title, summary, source url) */}
          <ShareLink
            className="linkedin"
            href={`https://www.linkedin.com/shareArticle?url=${url}&title=${title}&summary=${description}&source=${url}`}
          >
            LinkedIn
          </ShareLink>
        </div>
      )}
    </div>
  )
}

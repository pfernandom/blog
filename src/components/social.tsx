import React from 'react'
import {
  SocialIcon,
  SocialIconDatabase,
} from 'react-social-icons/build/react-social-icons-lite'
import facebook from 'react-social-icons/build/networks/facebook'
import twitter from 'react-social-icons/build/networks/twitter'
import reddit from 'react-social-icons/build/networks/reddit'
import linkedin from 'react-social-icons/build/networks/linkedin'
import instagram from 'react-social-icons/build/networks/instagram'
import medium from 'react-social-icons/build/networks/medium'
import rss from 'react-social-icons/build/networks/rss'
import useScrollPosition from 'src/helpers/use-scroll-position'

SocialIconDatabase.importNetworks([
  facebook,
  instagram,
  twitter,
  reddit,
  linkedin,
  medium,
  rss,
])

export default function SocialPane({}) {
  const scrollPosition = useScrollPosition()
  const opacity = 1 - Math.min(scrollPosition * 100, 0.9)

  return (
    <div className="social-icons-section" style={{ opacity }}>
      <SocialIcon
        url="https://www.instagram.com/pedro.marquez.soto/"
        fgColor="white"
        style={{ marginBottom: '10px' }}
      />
      <SocialIcon
        url="https://www.linkedin.com/in/pedro-fernando-m%C3%A1rquez-soto-1218a345/"
        fgColor="white"
        style={{ marginBottom: '10px' }}
      />
      <SocialIcon
        url="https://medium.com/@pfernandom"
        fgColor="white"
        style={{ marginBottom: '10px' }}
      />
      <SocialIcon
        network="rss"
        fgColor="white"
        url="https://medium.com/rss/atom.xml"
      />
    </div>
  )
}

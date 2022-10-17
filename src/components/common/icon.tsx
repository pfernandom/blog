import React from 'react'

import facebook from 'react-social-icons/build/networks/facebook'
import twitter from 'react-social-icons/build/networks/twitter'
import github from 'react-social-icons/build/networks/github'
import linkedin from 'react-social-icons/build/networks/linkedin'
import google from 'react-social-icons/build/networks/google'

export type IconProps = {
  icon: string
  mask: string
  color: string
  name: string
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  network: string
}

export function SocialSVG({ network }: { network: string }) {
  const networks: Record<string, IconProps> = {
    facebook,
    twitter,
    linkedin,
    github,
    google,
  }

  const n = networks[network]
  return (
    <svg
      className="social-svg"
      style={{ width: '3em', height: '3em', borderRadius: '3em' }}
      viewBox="0 0 64 64"
    >
      <g className="social-svg-mask">
        <path d={n.mask} style={{ fill: n.color }} />
      </g>
      <g className="social-svg-icon" style={{ fill: 'white' }}>
        <path d={n.icon} />
      </g>
    </svg>
  )
}

export function ButtonIcon({ network, className, ...props }: ButtonProps) {
  return (
    <button className={`button-icon ${className}`} {...props}>
      <SocialSVG network={network}></SocialSVG>
    </button>
  )
}

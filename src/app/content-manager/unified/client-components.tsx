'use client'

import Image, { ImageLoader } from 'next/image'
import React from 'react'

const imageLoader: ImageLoader = ({ src, width, quality }) => {
  return `/${src}?w=${width}&q=${quality || 75}`
}

export default function Img({
  src,
  alt,
  width,
  height,
}: {
  src: string | undefined
  alt: string | undefined
  width: `${number}` | number | undefined
  height: `${number}` | number | undefined
}) {
  if (!src || !alt) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} />
  }
  return (
    <Image
      loader={imageLoader}
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  )
}

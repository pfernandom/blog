'use client'

import NextImage, {
  ImageProps,
  ImageLoader,
  StaticImageData,
} from 'next/legacy/image'
import { useState } from 'react'

const customLoader: ImageLoader = ({ src, width, quality }) => {
  // console.log('custom loader', { src, width, quality })
  // return `${src}?w=${width}&q=${quality || 75}`
  // if (src.includes('/_next/static/')) {
  //   return `${src}?w=${width}&q=${quality || 75}`
  // }
  // return src
  return `${src}?w=${width}&q=${quality || 75}`
}

type BlogImageProps = ImageProps & { scale?: number; inline?: boolean }

export default function Image({
  className,
  width,
  height,
  objectFit = 'cover',
  scale = 1,
  inline = false,
  ...rest
}: BlogImageProps) {
  const { src } = rest

  const size =
    typeof src === 'string' ? { width, height } : (src as StaticImageData)

  const scaleNum = (
    n: number | `${number}` | undefined
  ): `${number}` | undefined => {
    if (typeof n === 'number') return `${scale * n}`
    return n
  }

  return (
    <div
      style={
        inline
          ? { display: 'inline' }
          : { display: 'flex', justifyContent: 'center' }
      }
    >
      <span className={['blog-img', className].join(' ')}>
        <NextImage
          width={scaleNum(width ?? size.width)}
          height={scaleNum(height ?? size.height)}
          objectFit={objectFit}
          {...rest}
          loader={customLoader}
        />
      </span>
    </div>
  )
}

export function ImageWithFallback(
  props: BlogImageProps & { fallbackSrc: string }
) {
  const { src, fallbackSrc, alt, ...rest } = props
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      {...rest}
      alt={alt}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
    />
  )
}

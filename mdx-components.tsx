import type { MDXComponents } from 'mdx/types'
import React from 'react'
import NextImage, {
  ImageProps,
  ImageLoader,
  StaticImageData,
} from 'next/legacy/image'
// import Image from 'app/_components/image'

const customLoader: ImageLoader = ({ src, width, quality }) => {
  // console.log('custom loader', { src, width, quality })
  // return `${src}?w=${width}&q=${quality || 75}`
  // if (src.includes('/_next/static/')) {
  //   return `${src}?w=${width}&q=${quality || 75}`
  // }
  // return src
  return `${src}?w=${width}&q=${quality || 75}`
}

export default function Image({
  className,
  width,
  height,
  objectFit = 'cover',
  scale = 1,
  inline = false,
  ...rest
}: ImageProps & { scale?: number; inline?: boolean }) {
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

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    // h1: ({ children }) => <h1 style={{ fontSize: "100px" }}>{children}</h1>,
    p: (props) => <p {...props} />,
    a: (props) => <a {...props} />,
    h1: (props) => <h1 {...props} />,
    img: (props) => {
      return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image {...(props as ImageProps)} layout="fill" placeholder="empty" />
      )
    },
    table: ({ children }) => {
      return (
        <div className="post-table-container">
          <table className="post-table">{children}</table>
        </div>
      )
    },
    ...components,
  }
}

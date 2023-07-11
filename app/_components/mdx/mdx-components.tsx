/* eslint-disable @typescript-eslint/ban-types */
// import styles from '../styles/Markdown.module.css';
import { MDXComponents } from 'mdx/types'
import { ImageProps } from 'next/legacy/image'
import React from 'react'
import { ReactElement } from 'react'

import Image from 'app/_components/image'

const MDXComponentsDef: MDXComponents = {
  p: (props: {}): ReactElement => <p {...props} />,
  a: (props: {}): ReactElement => <a {...props} />,
  h1: (props): ReactElement => <h1 {...props} />,
  img: (props): ReactElement => {
    return (
      // eslint-disable-next-line jsx-a11y/alt-text
      <Image {...(props as ImageProps)} layout="fill" placeholder="empty" />
    )
  },
  table: ({ children }): ReactElement => {
    return (
      <div className="post-table-container">
        <table className="post-table">{children}</table>
      </div>
    )
  },
  // code: Code,
}

export default MDXComponentsDef

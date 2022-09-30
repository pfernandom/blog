/* eslint-disable @typescript-eslint/ban-types */
// import styles from '../styles/Markdown.module.css';
import { MDXComponents, MDXProps } from 'mdx/types'
import { ImageProps } from 'next/image'
import { ReactElement } from 'react'

import Image from 'src/components/image'

type Props = MDXProps

const MDXComponentsDef: MDXComponents = {
  p: (props: {}): ReactElement => <p {...props} />,
  a: (props: {}): ReactElement => <a {...props} />,
  h1: (props): ReactElement => <h1 {...props} />,
  img: (props): ReactElement => {
    return (
      <Image {...(props as ImageProps)} layout="fill" placeholder="empty" />
    )
  },
  // code: Code,
}

export default MDXComponentsDef

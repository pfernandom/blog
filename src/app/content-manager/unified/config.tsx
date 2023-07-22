import Img from './client-components'
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ImgHTMLAttributes,
} from 'react'
import { type Options } from 'rehype-react'
import { createElement, Fragment } from 'react'
import path from 'path'
import type { Element } from 'hast'
import React from 'react'

type WithNode = {
  node: Element
}

type ImageProperties =
  | { alt: string; width: `${number}` | number; height: `${number}` | number }
  | undefined

export const MyImage = ({
  src,
  alt,
  width,
  height,
}: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> &
  ImageProperties) => {
  const rightSrc = path.join('content', src ?? 'noimage.jpg')
  return <Img src={rightSrc} alt={alt} width={width} height={height} />
}

export function buildOptions(): Options {
  return {
    createElement,
    Fragment,
    components: {
      img: ({
        src,
        alt,
        node,
      }: DetailedHTMLProps<
        ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
      > &
        WithNode) => {
        const properties = node.properties as ImageProperties
        return (
          <Img
            src={src}
            alt={properties?.alt ?? alt}
            width={properties?.width}
            height={properties?.height}
          />
        )
      },
      p: ({ children }) => <p>{children}</p>,
      // table: (args) => <div>TABLE</div>,
      button: ({
        children,
        onClick,
      }: DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >) => <button onClick={onClick}>{children}</button>,
    },
    passNode: true,
  }
}

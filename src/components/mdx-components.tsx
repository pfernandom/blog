// import styles from '../styles/Markdown.module.css';
import { ReactElement } from "react";
import dynamic from "next/dynamic";
import Image from "src/components/image";
import { ImageProps } from "next/image";

type Props = JSX.IntrinsicAttributes;

const MDXComponentsDef: import("mdx/types").MDXComponents = {
  p: (props: {}): ReactElement => <p {...props} />,
  a: (props: {}): ReactElement => <a {...props} />,
  h1: (props): ReactElement => <h1 {...props} />,
  img: (props): ReactElement => {
    console.log({ MDXComponentsDef: props });
    return (
      <Image {...(props as ImageProps)} layout="fill" placeholder="empty" />
    );
  },
};

export default MDXComponentsDef;

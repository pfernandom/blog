// import styles from '../styles/Markdown.module.css';
import { MDXComponents, MDXProps } from 'mdx/types'
import { ImageProps } from 'next/image'
import { ReactElement } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import Image from 'src/components/image'

type Props = MDXProps

// function test() {
//   return (
//     <ReactMarkdown
//                 components={{
//                     p: ({ node, children }) => {
//                         ...
//                     },
//                     code({ className, children }) {
//                         // Removing "language-" because React-Markdown already added "language-"
//                         const language = className.replace("language-", "");
//                         return (
//                             <SyntaxHighlighter
//                                 style={materialDark}
//                                 language={language}
//                                 children={children[0]}
//                             />
//                         );
//                     },
//                 }}
//             >
//                 {post.content}
//             </ReactMarkdown>
//   )
// }

// function code({node, inline, className, children, ...props}) {
//   const match = /language-(\w+)/.exec(className || '')
//   return !inline && match ? (
//     <SyntaxHighlighter
//       children={String(children).replace(/\n$/, '')}
//       style={dark}
//       language={match[1]}
//       PreTag="div"
//       {...props}
//     />
//   ) : (
//     <code className={className} {...props}>
//       {children}
//     </code>
//   )
// };

function extractCode(children: string, className: string) {
  if (className?.length ?? 0 > 0) {
    return className
  }
  // return null
  return (
    (children.match(
      /(List<)|(new )|(ObjectMapper)|(java.)|(Future)|(Thread)|(Runnable)|(ForkJoinPool)|([a-z]+?\.?[a-z]+\()/
    ) &&
      'java') ||
    (children.match(/(@)/i) && 'dart') ||
    (children.match(/(then)|(Promise)/) && 'js') ||
    (children.match(/(<[a-z]+>?)/) && 'html') ||
    (children.match(/[a-z]+.[a-z]+^/) && 'uri')
  )
}

function isInlineWithCode(children: any, className: string) {
  const isString = typeof children == 'string'

  const isInline =
    isString &&
    (className?.length > 0 || extractCode(children, className) != null)

  return isInline
}

const MDXComponentsDef: MDXComponents = {
  p: (props: {}): ReactElement => <p {...props} />,
  a: (props: {}): ReactElement => <a {...props} />,
  h1: (props): ReactElement => <h1 {...props} />,
  img: (props): ReactElement => {
    return (
      <Image {...(props as ImageProps)} layout="fill" placeholder="empty" />
    )
  },
  code({ node, inline, className, children, ...props }: any) {
    if (isInlineWithCode(children, className)) {
      return (
        <SyntaxHighlighter
          useInlineStyles={false}
          customStyle={{ backgroundColor: '#f5f2f0' }}
          language={extractCode(children, className)}
          PreTag="span"
          {...props}
        >
          {children}
        </SyntaxHighlighter>
      )
    }

    return <code>{children}</code>
  },
}

export default MDXComponentsDef

import React from 'react'
import Refractor from 'react-refractor'

import jsx from 'refractor/lang/jsx.js'
import javascript from 'refractor/lang/javascript.js'
import css from 'refractor/lang/css.js'
import cssExtras from 'refractor/lang/css-extras.js'
import jsExtras from 'refractor/lang/js-extras.js'
import sql from 'refractor/lang/sql.js'
import typescript from 'refractor/lang/typescript.js'
import swift from 'refractor/lang/swift.js'
import objectivec from 'refractor/lang/objectivec.js'
import markdown from 'refractor/lang/markdown.js'
import json from 'refractor/lang/json.js'
import dart from 'refractor/lang/dart.js'
import java from 'refractor/lang/java.js'
import bash from 'refractor/lang/bash.js'

function extractCode(children: string, className: string) {
  if (className?.length ?? 0 > 0) {
    return className.includes('-') ? className.split('-')[1] : className
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

export default function Code({
  node,
  inline,
  className,
  children,
  ...props
}: any) {
  if (isInlineWithCode(children, className)) {
    console.log({ lang: extractCode(children, className) })

    Refractor.registerLanguage(jsx)
    Refractor.registerLanguage(json)
    Refractor.registerLanguage(typescript)
    Refractor.registerLanguage(javascript)
    Refractor.registerLanguage(css)
    Refractor.registerLanguage(cssExtras)
    Refractor.registerLanguage(jsExtras)
    Refractor.registerLanguage(sql)
    Refractor.registerLanguage(swift)
    Refractor.registerLanguage(objectivec)
    Refractor.registerLanguage(markdown)
    Refractor.registerLanguage(dart)
    Refractor.registerLanguage(java)
    Refractor.registerLanguage(bash)

    return (
      <Refractor
        language={extractCode(children, className) ?? ''}
        value={children}
        inline={true}
      />
    )
  }

  return <code>{children}</code>
}

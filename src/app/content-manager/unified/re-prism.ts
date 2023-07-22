import { Element, Root, toString as nodeToString } from 'hast-util-to-string'
import refractor from 'refractor/core.js'
import { Transformer } from 'unified'
import { visit } from 'unist-util-visit'

import bash from 'refractor/lang/bash.js'
import cssExtras from 'refractor/lang/css-extras.js'
import css from 'refractor/lang/css.js'
import dart from 'refractor/lang/dart.js'
import go from 'refractor/lang/go.js'
import java from 'refractor/lang/java.js'
import javascript from 'refractor/lang/javascript.js'
import jsExtras from 'refractor/lang/js-extras.js'
import json from 'refractor/lang/json.js'
import jsx from 'refractor/lang/jsx.js'
import markdown from 'refractor/lang/markdown.js'
import python from 'refractor/lang/python.js'
import rust from 'refractor/lang/rust.js'
import sql from 'refractor/lang/sql.js'
import typescript from 'refractor/lang/typescript.js'
import yaml from 'refractor/lang/yaml.js'
import { BuildVisitor } from 'unist-util-visit/complex-types'

refractor.register(jsx)
refractor.register(json)
refractor.register(typescript)
refractor.register(javascript)
refractor.register(css)
refractor.register(cssExtras)
refractor.register(jsExtras)
refractor.register(sql)
refractor.register(markdown)
refractor.register(dart)
refractor.register(java)
refractor.register(bash)
refractor.register(yaml)
refractor.register(rust)
refractor.register(python)
refractor.register(go)

refractor.alias({ jsx: ['js'] })

const rePrism = (): void | Transformer<Root, Root> => {
  return (tree: Root) => {
    visit(tree, 'element', visitor)
  }
}

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
    (children.match(/(<[a-z]+>?)/) && 'jsx') ||
    (children.match(/data-[a-z0-9]*/) && 'jsx') ||
    (children.match(/(prefers-color-scheme)/) && 'css') ||
    'bash'
  )
}

type ElementWithValue = Element & { value: string }

const visitor: BuildVisitor<Root, 'element'> = (
  oNode: Element,
  index,
  parent
) => {
  const node = oNode as ElementWithValue
  const properties = node.properties as
    | { className: string[] | string | undefined }
    | undefined

  if (
    parent?.type === 'element' &&
    parent?.tagName !== 'pre' &&
    node.tagName === 'code'
  ) {
    const value =
      node.value ??
      node.children
        .map((c) => c.type === 'text' && c.value)
        .filter((el) => el)
        .join(',') ??
      ''

    const codeLang = extractCode(
      value,
      Array.isArray(properties?.className)
        ? properties?.className.join('') ?? ''
        : properties?.className ?? ''
    )
    try {
      if (properties && codeLang !== null) {
        const result = refractor.highlight(` ${nodeToString(node)} `, codeLang)
        properties.className = ['language-' + codeLang]
        node.children = result
        return null
      }
    } catch (err) {
      console.error('Problem highlighting ' + node, err)
    }
  }
  if (
    !parent ||
    (parent.type === 'element' && parent.tagName !== 'pre') ||
    node.tagName !== 'code'
  ) {
    return null
  }

  const lang = getLanguage(node)

  if (lang === null) {
    return null
  }

  let result
  try {
    if (properties) {
      properties.className = (properties.className ?? ([] as string[])).concat(
        'language-' + lang
      )
    }
    result = refractor.highlight(nodeToString(node), lang)
  } catch (err) {
    if (/Unknown language/.test((err as { message: string }).message)) {
      return null
    }
    throw err
  }

  node.children = result
  return null
}

function getLanguage(node: Element) {
  const className = node.properties?.className || []

  for (const classListItem of className as string[]) {
    if (classListItem.slice(0, 9) === 'language-') {
      return classListItem.slice(9).toLowerCase()
    }
  }

  return null
}

export default rePrism

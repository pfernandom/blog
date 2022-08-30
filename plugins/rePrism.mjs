import { visit } from 'unist-util-visit'
import { toString as nodeToString } from 'hast-util-to-string'
import refractor from 'refractor/core.js'

import jsx from 'refractor/lang/jsx.js'
import javascript from 'refractor/lang/javascript.js'
import css from 'refractor/lang/css.js'
import cssExtras from 'refractor/lang/css-extras.js'
import jsExtras from 'refractor/lang/js-extras.js'
import sql from 'refractor/lang/sql.js'
import typescript from 'refractor/lang/typescript.js'
import markdown from 'refractor/lang/markdown.js'
import json from 'refractor/lang/json.js'
import dart from 'refractor/lang/dart.js'
import java from 'refractor/lang/java.js'
import bash from 'refractor/lang/bash.js'

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

refractor.alias({ jsx: ['js'] })

const rePrism = (options) => {
  options = options || {}

  if (options.alias) {
    refractor.alias(options.alias)
  }

  return (tree) => {
    visit(tree, 'element', visitor)
  }

  function visitor(node, index, parent) {
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return
    }

    const lang = getLanguage(node)

    if (lang === null) {
      return
    }

    let result
    try {
      parent.properties.className = (parent.properties.className || []).concat(
        'language-' + lang
      )
      result = refractor.highlight(nodeToString(node), lang)
    } catch (err) {
      if (options.ignoreMissing && /Unknown language/.test(err.message)) {
        return
      }
      throw err
    }

    node.children = result
  }
}

function getLanguage(node) {
  const className = node.properties.className || []

  for (const classListItem of className) {
    if (classListItem.slice(0, 9) === 'language-') {
      return classListItem.slice(9).toLowerCase()
    }
  }

  return null
}

export default rePrism

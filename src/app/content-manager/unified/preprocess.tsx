import { Root } from 'hast'
import fs from 'node:fs'
import { Transformer } from 'unified'
import { visit } from 'unist-util-visit'
import { moveAndProcessImage } from './image-processing'

const fileMapPath = '.next/content_map.json'

export function preprocessPlugin({
  contentPath,
}: {
  contentPath: string
}): void | Transformer<Root, Root> {
  return (tree) => {
    const fileNameMap: Record<string, string> = fs.existsSync(fileMapPath)
      ? JSON.parse(fs.readFileSync(fileMapPath, 'utf8'))
      : {}
    visit(tree, 'element', (node) => {
      switch (node.tagName) {
        case 'img':
          const src = node.properties?.src
          const alt = node.properties?.alt

          if (node.properties && src && typeof src === 'string') {
            const [maybeImageProperties, publicPath] = moveAndProcessImage(
              contentPath,
              src,
              alt as string | null | undefined,
              fileNameMap
            )
            node.properties = { ...maybeImageProperties, ...node.properties }
            node.properties.src = publicPath
          }
      }
    })

    fs.writeFileSync(fileMapPath, JSON.stringify(fileNameMap, null, 2))
  }
}

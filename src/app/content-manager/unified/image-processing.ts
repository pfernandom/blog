import fs from 'node:fs'
import path from 'path'
import sharp from 'sharp'

/**
 * Parse attributes like:
 * ![alt="Hero image",width=100,height=100](./hero.jpeg)
 * @param src the image source
 * @returns a map of properties or undefined
 */
export function parseImageSource(
  src: string
): Record<string, string> | undefined {
  return src
    .match(/(\w+?=[\w\s\d"]+)*/g)
    ?.filter((el) => el.length)
    .map((el) => el.split('='))
    .reduce((acc, el) => ({ [el[0]]: el[1], ...acc }), {})
}

/**
 * Move image to public folder, and perform optimizations on it
 * @param filePath the original image path
 * @param outputPath the output path for the image
 * @param width optional width for resizing
 * @param height optional height for resizing
 */
function resizeAndMoveToPublic(
  filePath: string,
  outputPath: string,
  width?: number | null,
  height?: number | null
) {
  try {
    const sh = sharp(filePath)
    if (width && height) {
      sh.resize({
        width,
        height,
        fit: 'cover',
      })
    }
    sh.toFile(outputPath)
  } catch (error) {
    throw new Error(`Could not process image ${filePath}: \n${error}`)
  }
}

/**
 * Extract image properties from the Markdown "alt" text field.
 *
 * @param alt the alt text field, possibly with properties
 * @returns a map of properties, if they exist
 */
function getMaybeImageProperties(alt?: string | null) {
  const maybeProperties = parseImageSource(alt as string)
  if (!maybeProperties) {
    return null
  }

  return {
    width: maybeProperties['width'] ? parseInt(maybeProperties['width']) : null,
    height: maybeProperties['height']
      ? parseInt(maybeProperties['height'])
      : null,
    alt: maybeProperties['alt'],
  }
}

interface MDImageProperties {
  width: number | null
  height: number | null
  alt: string
}

export function moveAndProcessImage(
  contentPath: string,
  src: string,
  alt: string | undefined | null,
  fileNameMap: Record<string, string>
): [MDImageProperties | null, string] {
  const filePath = path.join(path.dirname(contentPath), src as string)
  const publicPath = path.join('static', filePath)
  const outputPath = path.join('public', publicPath)

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  if (
    fileNameMap[`${contentPath}_${src}`] &&
    fileNameMap[`${contentPath}_${src}`] !== filePath
  ) {
    fs.unlinkSync(fileNameMap[`${contentPath}_${src}`])
  }
  fileNameMap[`${contentPath}_${src}`] = filePath

  const maybeProperties = getMaybeImageProperties(alt)

  if (maybeProperties && maybeProperties.width && maybeProperties.height)
    resizeAndMoveToPublic(
      filePath,
      outputPath,
      maybeProperties.width,
      maybeProperties.height
    )

  // node.properties.src = publicPath
  return [maybeProperties, publicPath]
}

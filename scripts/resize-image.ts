import fs from 'fs'
import path, { join } from 'path'
import sharp from 'sharp'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

type FileInfo = {
  fileName: string
  filePath: string
  dirPath: string
}

const postsDirectory = join(process.cwd(), 'src', 'blog')

const getAllFiles = function (
  dirPath: string,
  pattern: RegExp,
  arrayOfFiles: Array<FileInfo> | undefined = []
) {
  const files = fs.readdirSync(dirPath)
  console.log({ dirPath, files })

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function (file) {
    const regex = new RegExp(pattern)
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, regex, arrayOfFiles)
    } else {
      if (regex.test(file)) {
        console.log(file)
        const relativePath = path.relative(
          postsDirectory,
          path.join(dirPath, '/')
        )
        arrayOfFiles.push({
          fileName: file,
          filePath: [relativePath, '/', file].join(''),
          dirPath: relativePath,
        })
      } else {
        console.log(`Found "${file}": Failed to match ${regex} Not processed`)
        console.log(file.match(regex))
      }
    }
  })

  return arrayOfFiles
}

function getSize(meta: sharp.Metadata, opts: Partial<Options>) {
  const defaultHeight = 200
  const defaultWidth = 400
  let width = meta.width ?? defaultWidth
  let height = meta.height ?? defaultHeight

  if (opts.scale != null) {
    return {
      width: Math.round(width * opts.scale!),
      height: Math.round(height * scale!),
    }
  }

  return {
    width: Math.round(width * (opts.scaleX ?? 1)),
    height: Math.round(height * (opts.scaleY ?? 1)),
  }
}

async function main(filePath: string, opts: Options) {
  const { name: newFileName, ext, scale } = opts
  const dir = path.dirname(filePath)

  const regex = /(jpeg|jpg|png)/gi
  const gifRegex = /(gif)/gi

  const name =
    newFileName.length === 0
      ? `_opt_${path.basename(filePath).replace(regex, ext || 'webp')}`
      : newFileName
  console.log({ dir, name })

  const srcPath = path.join(process.cwd(), 'src')
  const dirRelativeToSrc = path.relative(srcPath, dir)
  const saveDirPath = path.join(
    process.cwd(),
    'public',
    'opt_images',
    dirRelativeToSrc
  )

  fs.mkdirSync(saveDirPath, {
    recursive: true,
  })

  const imageParams = await sharp(filePath).metadata()

  const crop = 'cover'
  const { width, height } = getSize(imageParams, opts)

  let proc = sharp(filePath, {
    animated: !!name.match(gifRegex),
  })

  console.log({ ext })
  switch (ext) {
    case 'jpeg':
    case 'jpeg':
      proc = proc.jpeg().flatten({ background: { r: 255, g: 255, b: 255 } })
      break
    case 'jpg':
      proc = proc.jpeg().flatten({ background: { r: 255, g: 255, b: 255 } })
      break
    case 'png':
      proc = proc.png().flatten({ background: { r: 255, g: 255, b: 255 } })
      break
    case 'webp':
      proc = proc.webp({ lossless: false, quality: 90 })
      break
    default:
      proc = proc.webp({ lossless: false, quality: 90 })
  }

  proc = proc.resize(width, height, {
    fit: crop,
  })

  const buff = await proc.toBuffer()
  const outMeta = await sharp(buff).metadata()

  console.log({ outMeta })
  console.log('Using ext=' + ext)

  proc
    .toFile(`${dir}/${name}`, function (err) {
      // output.jpg is a 300 pixels wide and 200 pixels high image
      // containing a scaled and cropped version of input.jpg
      if (err) {
        console.error(err)
      }
    })
    .toFile(`${saveDirPath}/${name}`, function (err) {
      // output.jpg is a 300 pixels wide and 200 pixels high image
      // containing a scaled and cropped version of input.jpg
      if (err) {
        console.error(err)
      }
    })
}

type Options = {
  name: string
  export: boolean
  ext: string
  scale?: number
  scaleX?: number
  scaleY?: number
}

const args = yargs(hideBin(process.argv))
  .usage(
    `Usage: $0 [string] -name [string] -ext [string] -export [bool]
  
  Common configs: 
  - Dev.to:
  npx ts-node --project tsconfig-scripts.json ./scripts/resize-image.ts src/blog/2022/8/flutter-code-gen-1/hero.jpeg --name devto.png --ext png --scaleX 1 --scaleY 0.42
  
  `
  )
  .demandCommand(1)
  .options({
    name: { type: 'string', default: '' },
    export: { type: 'boolean', default: false },
    ext: { type: 'string', default: '' },
    scale: { type: 'number' },
    scaleX: { type: 'number' },
    scaleY: { type: 'number' },
  })
  .parseSync()

const { name, export: exprt, ext, scale, scaleX, scaleY }: Options = args
console.log({ args })
main(process.argv[2], {
  name,
  export: exprt,
  ext,
  scale,
  scaleX,
  scaleY,
})

/// npx ts-node  --project tsconfig-scripts.json ./scripts/resize-image.ts ./src/blog/2022/7/dark-mode-css/hero.jpeg --name hero.webp --export

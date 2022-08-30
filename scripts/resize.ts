import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { getAllFiles, postsDirectory } from './common'

const BLOG_POST_IMG_WIDTH = 440
const BLOG_POST_IMG_HEIGHT = 220

function main() {
  console.log('Optimizing images...')
  const regexExt = /\.(jpeg|jpg|png|gif)$/gi
  const files = getAllFiles(postsDirectory, regexExt, [])

  const optimizedRegex = /\.(webp)$/gi
  const optimizedImages = getAllFiles(postsDirectory, optimizedRegex, [])

  //const imagesToResize = checkSizes();

  optimizedImages.forEach(
    ({ fileName, filePath: fileRelativePath, dirPath }) => {
      const filePath = path.join(postsDirectory, fileRelativePath)
      const saveDirPath = path.join(
        process.cwd(),
        'public',
        'opt_images',
        'blog',
        dirPath
      )
      fs.mkdirSync(saveDirPath, {
        recursive: true,
      })

      sharp(filePath)
        .metadata()
        .then(({ width, height }) => {
          processImage(
            filePath,
            width,
            height,
            saveDirPath,
            fileName,
            regexExt,
            false
          )
        })

      fs.copyFileSync(filePath, path.join(saveDirPath, fileName))
    }
  )

  files.forEach(({ fileName, filePath: fileRelativePath, dirPath }) => {
    const filePath = path.join(postsDirectory, fileRelativePath)
    const saveDirPath = path.join(
      process.cwd(),
      'public',
      'opt_images',
      'blog',
      dirPath
    )
    fs.mkdirSync(saveDirPath, {
      recursive: true,
    })

    sharp(filePath)
      .metadata()
      .then(({ width, height }) => {
        if (filePath.includes('.gif')) {
          processGifImage(filePath, saveDirPath, fileName, regexExt)
        } else {
          processImage(filePath, width, height, saveDirPath, fileName, regexExt)
        }
      })
  })

  console.log('Images optimized')
}

main()
function processImage(
  filePath: string,
  width: number | undefined,
  height: number | undefined,
  saveDirPath: string,
  fileName: string,
  regexExt: RegExp,
  optimize: boolean = true
) {
  let process = sharp(filePath)
    //.resize(400)
    .blur(5)
    .webp({ lossless: false, quality: 50 })

  process = resizeIfNeeded(filePath, width, height, process)

  process.toFile(
    path.join(saveDirPath, `blur_${fileName.replace(regexExt, '.webp')}`),
    function (err) {
      // output.jpg is a 300 pixels wide and 200 pixels high image
      // containing a scaled and cropped version of input.jpg
      if (err) {
        console.error(err)
      }
    }
  )

  let process2 = sharp(filePath)

  if (optimize) {
    process2 = process2.webp({ lossless: false, quality: 90 })
  }

  process2 = resizeIfNeeded(filePath, width, height, process2)

  process2.toFile(
    path.join(saveDirPath, fileName),

    function (err) {
      // output.jpg is a 300 pixels wide and 200 pixels high image
      // containing a scaled and cropped version of input.jpg
      if (err) {
        console.error(err)
      }
    }
  )

  process2.toFile(
    path.join(saveDirPath, fileName.replace(regexExt, '.webp')),

    function (err) {
      // output.jpg is a 300 pixels wide and 200 pixels high image
      // containing a scaled and cropped version of input.jpg
      if (err) {
        console.error(err)
      }
    }
  )
}

function resizeIfNeeded(
  filePath: string,
  width: number | undefined,
  height: number | undefined,
  process: sharp.Sharp
) {
  const crop = 'cover'

  if (
    filePath.includes('hero') &&
    (width != BLOG_POST_IMG_WIDTH || height != BLOG_POST_IMG_HEIGHT)
  ) {
    console.log('Resize image ' + filePath)
    process = process.resize(BLOG_POST_IMG_WIDTH, BLOG_POST_IMG_HEIGHT, {
      fit: crop,
    })
  }
  return process
}

function processGifImage(
  filePath: string,
  saveDirPath: string,
  fileName: string,
  regexExt: RegExp
) {
  sharp(filePath, { animated: true })
    .webp({
      lossless: false,
      quality: 90,
    })
    .toFile(
      path.join(saveDirPath, fileName.replace(regexExt, '.webp')),

      function (err) {
        // output.jpg is a 300 pixels wide and 200 pixels high image
        // containing a scaled and cropped version of input.jpg
        if (err) {
          console.error(err)
        }
      }
    )
}

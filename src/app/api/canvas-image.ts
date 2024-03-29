// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

type Data = {
  names: Array<string>
}

type Error = {
  cause: string
}

type RequestData = {
  img: Array<string>
  fileName: string
}

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  try {
    const body: RequestData = JSON.parse(req.body)
    console.log('Got request')
    const regex = /^data:.+?\/(.+?);base64,(.*?)$/

    // console.log({ body })
    if (!body.img || body.img.length == 0 || !body.fileName) {
      return res.status(500).send({ cause: 'Not all fields are present' })
    }

    const filePaths = body.img.map((img, i) => {
      const string = img
      console.log('Matching regex')
      const matches = string.match(regex) ?? []
      console.log('Matched regex')
      const ext = matches[1]
      const data = matches[2]
      console.log('Start parsing image')
      const buffer = Buffer.from(data, 'base64')
      console.log('Ended parsing image')

      const saveDirPath = path.join(
        process.cwd(),
        'public',
        'opt_images',
        'instagram'
      )

      console.log(path.resolve(path.join(saveDirPath, body.fileName, '..')))

      fs.mkdirSync(path.resolve(path.join(saveDirPath, body.fileName, '..')), {
        recursive: true,
      })

      console.log('Start writting image')
      const filePath = path.join(saveDirPath, `${body.fileName}-${i}.` + ext)
      fs.writeFileSync(filePath, buffer)
      console.log('Finished writting image')
      return filePath
    })

    return res.status(200).json({ names: filePaths })
  } catch (err: unknown) {
    console.error('Failed to saved images:', err)
    return res.status(500).send({ cause: `${err}` })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

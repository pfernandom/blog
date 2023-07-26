import { schema } from 'app/types/jsonschema'
import matter from 'gray-matter'
import { Schema, Validator } from 'jsonschema'
import { Post } from '../manager'
import UrlManager from '../url-manager'
import fs from 'node:fs'

function unmarshall(instance: string, schema: Schema) {
  // if (schema.id === 'http://example.com/date') {
  //   return new Date(instance)
  // }
  return instance
}

export function isValid(data: unknown) {
  const v = new Validator()
  const vr = v.validate(data, schema)
  if (vr.valid) {
    return true
  }
  return [false, vr.errors]
}

export function fromFrontMatter(content: string) {
  const fm = matter(content)
  const v = new Validator()
  const validationResult =
    fm.data && v.validate(fm.data, schema, { rewrite: unmarshall })
  if (fm.data && validationResult.valid) {
    const urlManager = new UrlManager()
    const post = validationResult.instance
    if (!post.slug.includes('blog/')) {
      post.slug = urlManager.getSlugFromPostInfo(post)
    }
    return post as Post
  }

  throw new Error(
    `Could not parse post. Not a valid result: ${JSON.stringify(
      fm.data,
      null,
      2
    )} \n ${validationResult.errors.map((e) => `- ${e}`).join('\n')}`
  )
}

export function contentFromFrontMatter(filePath: string) {
  const fm = matter(fs.readFileSync(filePath, 'utf8'))
  return fm.content
}

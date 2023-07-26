import { describe, expect, test } from '@jest/globals'
import { isValid } from 'app/content-manager/unified/frontmatter'
import { globSync } from 'glob'
import fs from 'node:fs'
import path from 'path'

describe('FrontMatter data parsing', function () {
  const testCases: [string, unknown, boolean][] = [
    [
      'All attributes',
      {
        slug: 'mypost',
        title: 'This is a test post',
        date: '1988-06-19',
        description: ['line 1', 'line 2'],
        hero_image: './hero.jpeg',
        hero_image_alt: 'A hero image for this post about state management',
        key_words: ['test', 'post'],
        published: true,
        legacy: true,
        test: true,
      },
      true,
    ],
  ]

  testCases.forEach(([name, content, expectedResult]) =>
    test(`Frontmatter: ${name}`, async function () {
      const post = isValid(content)
      expect(post).toBe(expectedResult)
    })
  )
})

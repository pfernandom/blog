import { describe, expect, test } from '@jest/globals'
// import { parseMarkdown } from './reimport.mjs'
import { parseMarkdown } from 'app/content-manager/unified/parse'
import fs from 'fs'
import renderer from 'react-test-renderer'

const TEST_POST_PATH = 'content/0_test_post/index.md'

describe('parse static markdown with unified', function () {
  test('it works correctly', async function () {
    const content = fs.readFileSync(TEST_POST_PATH, 'utf8')
    // const { data } = matter(fs.readFileSync(TEST_POST_PATH, 'utf8'))
    // const postData = validatePostData(data)
    const result = parseMarkdown(TEST_POST_PATH, content)

    const component = renderer.create(result)

    const tree = component.toJSON()
    expect(tree).toBeTruthy()
    expect(
      Array.isArray(tree) ? tree.length > 0 : tree?.children?.length ?? 0 > 0
    ).toBeTruthy()
    expect(tree).toMatchSnapshot()
  })
})

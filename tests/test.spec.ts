import assert from 'assert'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import fs from 'fs'
import { CommentsManager, Comment } from '../app/helpers/comment-manager'

const DB_NAME = 'blog'
const COMMENTS_COLLECTION = 'comments'

function flat(comments: Comment[]): Comment[] {
  let allReplies: Comment[] = []
  let replies = comments.flatMap((comment) => comment.replies ?? [])

  allReplies = allReplies.concat(replies)
  while (replies.length) {
    replies = replies.flatMap((comment) => comment.replies ?? [])

    allReplies = allReplies.concat(replies)
  }

  return allReplies
}

describe('Firestore rules', function () {
  beforeEach(async function () {
    this.slug = '3_test_post'
    this.testEnv = (await initializeTestEnvironment({
      projectId: 'demo-project-1234',
      firestore: {
        rules: fs.readFileSync('firestore.rules', 'utf8'),
        host: 'localhost',
        port: 8080,
      },
    })) as RulesTestEnvironment
    const ctx = (this.testEnv as RulesTestEnvironment).authenticatedContext(
      'pedro'
    )
    this.db = ctx.firestore() as unknown as Firestore
  })

  afterEach(async function () {
    await this.testEnv.clearFirestore()
  })

  xit('Allow to create comment', async function () {
    const commentsRef = collection(
      this.db,
      DB_NAME,
      this.slug,
      COMMENTS_COLLECTION
    )

    const comment: Comment = {
      name: 'Pedro',
      content: 'Hello world',
      created: Timestamp.fromDate(new Date()),
      photoUrl: 'phjotoo.jpeg',
      slug: '',
    }
    // Use the Firestore instance associated with this context
    await assertSucceeds(addDoc(commentsRef, comment))
  })

  xit('Deny to create empty comment', async function () {
    const commentsRef = collection(
      this.db,
      DB_NAME,
      this.slug,
      COMMENTS_COLLECTION
    )

    const comment: Comment = {
      name: '',
      content: '',
      created: Timestamp.fromDate(new Date()),
      slug: '',
    }
    // Use the Firestore instance associated with this context
    await assertFails(addDoc(commentsRef, comment))
  })

  xit('Allow to get comments', async function () {
    const commentsRef = collection(
      this.db,
      DB_NAME,
      this.slug,
      COMMENTS_COLLECTION
    )

    // Use the Firestore instance associated with this context
    await assertSucceeds(getDocs(commentsRef))
  })

  xit('should disallow writting to any other unknown collection', async function () {
    const commentsRef = collection(this.db, DB_NAME, this.slug, 'something')

    const comment: Comment = {
      name: '',
      content: '',
      created: Timestamp.fromDate(new Date()),
      slug: '',
    }
    await assertFails(addDoc(commentsRef, comment))
  })

  xit('should disallow writting to unknown properties', async function () {
    const commentsRef = collection(this.db, DB_NAME, this.slug, 'something')

    const comment: Comment | unknown = {
      name: '',
      content: '',
      created: Timestamp.fromDate(new Date()),
      slug: '',
      somethingElse: 'asdasdasd',
    }
    await assertFails(addDoc(commentsRef, comment))
  })

  xit('should allow getting all comments', async function () {
    const manager: CommentsManager = new CommentsManager(
      this.db,
      this.slug as string
    )

    const comment: Comment = {
      name: 'Pedro',
      content: 'Hello world',
      created: Timestamp.fromDate(new Date()),
      slug: '',
    }

    await manager.sendComment(comment)
    await manager.sendComment(comment)

    const comments = await manager.fetchComments(0)
    await assert(comments.length === 2)
  })

  xit('should allow replying to comments', async function () {
    const manager: CommentsManager = new CommentsManager(
      this.db,
      this.slug as string
    )

    const comment: Comment = {
      name: 'Pedro',
      content: 'Hello world',
      created: Timestamp.fromDate(new Date()),
      slug: '',
    }

    const savedComment = await manager.sendComment(comment)
    await manager.sendReply(comment, savedComment)

    const comments = await manager.fetchComments(0)
    assert(comments.length === 1)
    assert(comments.flatMap((comment) => comment.replies).length === 1)
  })

  xit('should allow replying to comments 2', async function () {
    const manager: CommentsManager = new CommentsManager(
      this.db,
      this.slug as string
    )

    const comment: Comment = {
      name: 'Pedro',
      content: 'Hello world',
      created: Timestamp.fromDate(new Date()),
      slug: '',
    }

    const savedComment = await manager.sendComment(comment)
    const reply1 = await manager.sendReply(comment, savedComment)
    await manager.sendReply(comment, reply1)

    const comments = await manager.fetchComments(0)
    assert(comments.length === 1)
    const replies = flat(comments) as Comment[]
    assert(replies.length === 2)
  })
})

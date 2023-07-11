import {
  addDoc,
  collection,
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
} from 'firebase/firestore'

export interface Comment {
  ref?: DocumentReference
  photoUrl?: string | null
  name: string
  content: string
  created: Timestamp
  slug: string
  parent?: DocumentReference
  replies?: Comment[]
}

export const DB_NAME = 'blog'
export const REPLIES_COLLECTION = 'replies'
export const COMMENTS_COLLECTION = 'comments'

export class CommentsManager {
  firestore: Firestore
  slug: string
  commentsRef: CollectionReference<DocumentData>
  localStorage?: Storage
  lastDoc?: QueryDocumentSnapshot<DocumentData>
  lastPage?: number = 0
  allComments: QueryDocumentSnapshot<DocumentData>[] = []

  constructor(db: Firestore, slug: string) {
    this.firestore = db
    this.slug = slug.replace(/\//gi, '-')
    this.commentsRef = collection(
      this.firestore,
      DB_NAME,
      this.slug,
      COMMENTS_COLLECTION
    )
  }

  setLocalStorage(localStorage: Storage) {
    this.localStorage = localStorage
  }

  async genData(slug: string) {
    const commentFactory = (count: number, text: string) =>
      Array(count)
        .fill(1)
        .map(
          (el, index) =>
            ({
              name: `People ${index}`,
              content: `${text} Content asdasd`,
              slug: slug,
              created: Timestamp.fromDate(new Date()),
            } as Partial<Comment>)
        )

    commentFactory(1, 'Comment:').forEach(async (comment) => {
      const docRef = await addDoc(this.commentsRef, comment)
      const doc1 = collection(docRef, REPLIES_COLLECTION)
      await addDoc(doc1, commentFactory(3, 'Reply:')[0])
    })
  }

  docToComment(d: QueryDocumentSnapshot<DocumentData>): Comment {
    const data = d.data()
    const ref = d.ref
    return {
      ref: ref,
      name: data.name,
      photoUrl: data.photoUrl,
      content: data.content,
      created: data.created,
      slug: data.slug,
      parent: data.parent,
    }
  }

  fetchReplies(
    red: DocumentReference<DocumentData> | undefined,
    docs: QueryDocumentSnapshot<DocumentData>[],
    used: Set<string | undefined>
  ): Comment[] {
    //const doc = await getDocs(collection(firestore, COMMENTS_COLLECTION));
    // const doc = await getDocs(collection(red, REPLIES_COLLECTION))

    const commentData: Array<Comment> =
      docs
        ?.map((d) => this.docToComment(d))
        .filter((doc) => !used.has(doc.ref?.id) && doc.parent?.id === red?.id)
        .map((result) => {
          used.add(result.ref?.id)
          result.replies = this.fetchReplies(result.ref, docs, used)
          return result
        }) ?? []

    return commentData
  }

  async refetchComments() {
    try {
      const elements = this.allComments.length
      this.allComments = []

      const c = collection(
        this.firestore,
        DB_NAME,
        this.slug,
        COMMENTS_COLLECTION
      )
      const doc = await getDocs(
        query(c, orderBy('created', 'desc'), limit(Math.max(elements, 1)))
      )
      this.allComments = doc.docs
      this.lastDoc = doc.docs[doc.docs.length - 1]

      return await this.decorateResults(doc.docs)
    } catch (err) {
      console.error(err)
      return []
    }
  }

  async fetchComments(page: number) {
    try {
      const c = collection(
        this.firestore,
        DB_NAME,
        this.slug,
        COMMENTS_COLLECTION
      )
      const lastDoc = this.lastDoc
      const lim = 6

      const lastPage = this.lastPage ?? 0

      const shouldGetNextPage = lastDoc && lastPage < page

      const q = shouldGetNextPage
        ? query(c, orderBy('created', 'desc'), startAfter(lastDoc), limit(lim))
        : query(c, orderBy('created', 'desc'), limit(lim))
      const doc = await getDocs(q)

      this.lastDoc = doc.docs[doc.docs.length - 1]

      if (shouldGetNextPage) {
        this.allComments = [...this.allComments, ...doc.docs]
      } else {
        this.allComments = doc.docs
      }
      return await this.decorateResults(this.allComments)
    } catch (err) {
      console.error(err)
      return []
    }
  }

  decorateResults(docs: QueryDocumentSnapshot<DocumentData>[]) {
    const commentData: Array<Comment> = docs
      .map((d) => this.docToComment(d))
      .filter((result) => !result.parent)
      .map((result) => {
        const used = new Set()
        used.add(result.ref?.id)
        result.replies = this.fetchReplies(result.ref, docs, new Set())
        return result
      })

    return Promise.all(commentData)
  }

  async sendComment(comment: Partial<Comment>): Promise<DocumentReference> {
    try {
      const d: Date = new Date(this.localStorage?.getItem('LCMT') ?? '')
      if (new Date().getTime() - d.getTime() < 300000) {
        this.localStorage?.setItem('LCMT', new Date().toISOString())
        return await new Promise((resolve) => {
          setTimeout(() => {
            resolve(addDoc(this.commentsRef, comment))
          }, 3000)
        })
      }
      const docRef: DocumentReference = await addDoc(this.commentsRef, comment)
      this.localStorage?.setItem('LCMT', new Date().toISOString())
      return docRef
    } catch (err) {
      console.error(err)
      return Promise.reject()
    }
  }

  async sendReply(
    comment: Partial<Comment>,
    parent: DocumentReference
  ): Promise<DocumentReference> {
    try {
      comment.parent = parent
      return await addDoc(this.commentsRef, comment)
    } catch (err) {
      console.error(err)
      return Promise.reject()
    }
  }
}

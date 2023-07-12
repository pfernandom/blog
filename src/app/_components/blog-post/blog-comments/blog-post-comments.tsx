import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AuthContext } from 'app/_components/auth/auth-context-provider'
import { Comment, CommentsManager } from 'app/helpers/comment-manager'
import { FirebaseContext } from 'app/blog/[...blog]/page-comments'
import SignInScreen from '../../auth/sign-in'
import CommentCard from './blog-comment-card'
import CommentForm from './blog-comment-form'
import CommentLoading from './blog-loading-card'

export function throttle<T>(
  time: number,
  fn: (args: T) => void
): (args: T) => void {
  let throttlePause = false
  return function (args: T) {
    if (throttlePause) return
    throttlePause = true
    setTimeout(() => {
      fn(args)
      throttlePause = false
    }, time)
  }
}

export default function BlogPostComments({ slug }: { slug: string }) {
  const ref = useRef<HTMLUListElement>(null)

  const firebase = useContext(FirebaseContext)

  const [isLoading, setIsLoading] = useState(true)
  const [timedOut, setTimedOut] = useState(false)
  const [page, setPage] = useState(0)
  const [isAddingComment, setIsAddingComment] = useState(false)

  const userState = useContext(AuthContext)

  const [comments, setComments] = useState([] as Array<Comment>)

  const manager = useMemo(
    () => (firebase.db ? new CommentsManager(firebase.db, slug) : null),
    [firebase.db, slug]
  )

  useEffect(() => {
    manager?.setLocalStorage(window.localStorage)

    const timer = setTimeout(() => {
      if (isLoading) {
        setTimedOut(isLoading)
      }
    }, 10000)

    const options = {
      rootMargin: '0px',
      threshold: 1.0,
    }

    const observer = new IntersectionObserver((data) => {
      const isInterSecting = data.filter((obs) => obs.isIntersecting).length > 0
      if (isInterSecting) {
        manager
          ?.fetchComments(page)
          .then((commentData) => {
            commentData.sort(
              (a, b) => b.created.toMillis() - a.created.toMillis()
            )
            setTimeout(() => setComments(commentData))
            setTimeout(() => setIsLoading(false))
            clearTimeout(timer)
          })
          .catch((err) => console.error(err))
      }
    }, options)

    setTimeout(() => {
      if (ref.current != null) {
        observer.observe(ref.current)
      }
    })
  }, [comments.length, isLoading, manager, page])

  const user = userState.user
  const isLoggedIn = !!user

  // const userState = new UserState()
  // if (credential) {
  //   userState.setUserCredential(credential)
  // }

  if (isLoading) {
    return (
      <div className="blog-comments-section blog-comments-loading">
        <ul ref={ref}>
          <li className="blog-comments__comment">
            <div className="loading-state"></div>
            <div className="loading-state"></div>
            <div className="loading-state"></div>
          </li>

          <CommentLoading />
        </ul>
      </div>
    )
  }

  if (timedOut) {
    return <></>
  }

  return (
    <>
      <hr />
      <div className="blog-comments-section">
        <SignInScreen slug={slug} />
        <CommentForm
          onSubmit={async (newComment) => {
            setIsAddingComment(true)
            newComment.slug = slug
            await manager?.sendComment(newComment)
            const updatedComments = (await manager?.refetchComments()) ?? []
            setIsAddingComment(false)
            setComments(updatedComments)
          }}
        />
        <ul ref={ref}>
          {isAddingComment && <CommentLoading />}
          {comments.map((comment) => (
            <CommentCard
              level={0}
              key={comment.ref?.id}
              comment={comment}
              isLoggedIn={isLoggedIn}
              onReply={async (newComment) => {
                newComment.slug = slug
                if (!newComment.parent) {
                  console.error('Could not reply to comment')
                  return
                }
                await manager?.sendReply(newComment, newComment.parent)

                const updatedComments = (await manager?.refetchComments()) ?? []
                setComments(updatedComments)
              }}
            />
          ))}
        </ul>
        {manager?.lastDoc && (
          <button
            className="btn"
            onClick={async () => {
              const updatedComments = await manager?.fetchComments(page + 1)
              setPage(page + 1)
              setComments(updatedComments)
            }}
          >
            More...
          </button>
        )}
      </div>
    </>
  )
}

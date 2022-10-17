import { useState } from 'react'
import { UserImage } from 'src/components/auth/sign-in'
import { Comment } from 'src/helpers/comment-manager'

import CommentForm, {
  CommentCallback,
} from '../blog-comments/blog-comment-form'

export default function CommentCard({
  comment,
  onReply,
  isLoggedIn,
  level,
}: {
  comment: Comment
  onReply?: CommentCallback
  isLoggedIn: boolean
  level: number
}) {
  const [isReplyExpanded, expandReply] = useState(false)

  const isReplyEnabled = level < 2
  return (
    <li className="blog-comments__comment">
      <div className="blog-comments__comment_header">
        <UserImage
          user={{ displayName: comment.name, photoURL: comment.photoUrl }}
        />
        <div>
          <span className="username">{comment.name}</span>
          <span style={{ fontStyle: 'italic' }}>
            {' '}
            said on{' '}
            <span>
              {comment.created.toDate().toLocaleDateString('en-us', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              :
            </span>
          </span>
        </div>
      </div>
      <p className="blog-comments__content"> {comment.content}</p>
      {isReplyExpanded ? (
        <CommentForm
          parent={comment.ref}
          onSubmit={(result) => {
            expandReply(false)
            if (onReply != null) {
              return onReply(result)
            }
            return Promise.resolve()
          }}
        />
      ) : (
        isReplyEnabled &&
        isLoggedIn && (
          <button
            className="btn"
            onClick={() => {
              expandReply(true)
            }}
          >
            Reply
          </button>
        )
      )}
      <ul>
        {comment.replies?.map((reply) => (
          <CommentCard
            level={level + 1}
            isLoggedIn={isLoggedIn}
            key={reply.ref?.id}
            comment={reply}
            onReply={onReply}
          />
        ))}
      </ul>
    </li>
  )
}

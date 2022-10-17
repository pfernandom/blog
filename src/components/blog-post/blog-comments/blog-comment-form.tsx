import { DocumentReference, Timestamp } from 'firebase/firestore'
import React, { useCallback, useContext, useState } from 'react'
import { AuthContext } from 'src/components/auth/auth-context-provider'
import { Comment } from 'src/helpers/comment-manager'
import { throttle } from './blog-post-comments'

export type CommentCallback = (comments: Comment) => Promise<void>

function RichTextArea({
  onChange,
  disabled = false,
}: {
  onChange: (ev: React.ChangeEvent<HTMLTextAreaElement>) => void
  disabled: boolean
}) {
  const [wordCount, setWordCount] = useState(0)

  const handler = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWordCount(ev.target.value.length)
    onChange(ev)
  }

  throttle<React.ChangeEvent<HTMLTextAreaElement>>(200, handler)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandler = useCallback(
    throttle<React.ChangeEvent<HTMLTextAreaElement>>(200, handler),
    [null]
  )

  return (
    <div className="blog-comments-text-area">
      <textarea
        aria-label="Comments content"
        onChange={debouncedHandler}
        placeholder="Add a comment..."
        maxLength={500}
        minLength={5}
        name="content"
        rows={5}
        style={{ width: '100%' }}
        required={true}
        disabled={disabled}
      ></textarea>
      <div className="blog-comments-char-count">{wordCount}/500</div>
    </div>
  )
}

export default function CommentForm({
  onSubmit,
  parent,
}: {
  onSubmit: CommentCallback
  parent?: DocumentReference
}) {
  const [isValid, setIsValid] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const userState = useContext(AuthContext)
  const { user } = userState
  return (
    <form
      onSubmit={async (form) => {
        form.preventDefault()
        const contentInput = form.currentTarget.elements.namedItem(
          'content'
        ) as HTMLTextAreaElement

        const newComment: Comment = {
          name: user?.displayName ?? '',
          photoUrl: user?.photoURL ?? null,
          content: contentInput.value,
          slug: '',
          created: Timestamp.fromDate(new Date()),
        }

        if (parent) {
          newComment.parent = parent
        }
        setIsProcessing(true)
        await onSubmit(newComment)
        contentInput.value = ''
        setIsProcessing(false)
      }}
    >
      <label>
        <RichTextArea
          onChange={(ev) => {
            const evValid = ev.target.validity.valid
            setIsValid(evValid)
          }}
          disabled={isProcessing}
        />
      </label>
      <button className="btn" type="submit" disabled={!isValid || isProcessing}>
        {isProcessing ? 'Sending...' : 'Submit'}
      </button>
    </form>
  )
}

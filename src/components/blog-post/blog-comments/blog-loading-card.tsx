import { UserImage } from 'src/components/auth/sign-in'

export default function CommentLoading() {
  return (
    <li className="blog-comments__comment">
      <div className="blog-comments__comment_header">
        <UserImage user={{}} />
        <div>
          <div className="loading-state loading-state--heading"></div>
        </div>
      </div>
      <div className="blog-comments__content">
        <div className="loading-state"></div>
        <div className="loading-state"></div>
        <div className="loading-state loading-state--heading"></div>
      </div>
    </li>
  )
}

import {
  AuthProvider,
  AuthCredential,
  signInWithPopup,
  getAuth,
  linkWithCredential,
  UserCredential,
} from 'firebase/auth'
import { useContext } from 'react'
import { FirebaseContext } from 'app/blog/[...blog]/page-comments'
import { AuthProviderFn } from './sign-in'

export interface MergeAccountsProps {
  email: string
  existingProvider: AuthProviderFn
  newProvider: AuthProvider
  credential: AuthCredential
  onMerge: (user: UserCredential) => void
  onCancel: () => void
}

export default function MergeAccountsAction(props: MergeAccountsProps) {
  const firebase = useContext(FirebaseContext)
  return (
    <div className="merge-warning">
      The email for account you tried to use is already linked to another
      provider ({props.existingProvider.PROVIDER_ID}). Want to merge them?{' '}
      <button
        className="btn"
        onClick={async () => {
          try {
            const prov = new props.existingProvider().setCustomParameters({
              login_hint: props.email,
            })

            if (!prov) {
              throw new Error('Unrecognized provider')
            }
            const cred = await signInWithPopup(getAuth(firebase.app), prov)
            const newCred = await linkWithCredential(
              cred.user,
              props.credential
            )
            props.onMerge(newCred)
          } catch (err) {
            console.error(err)
            props.onCancel()
          }
        }}
      >
        Yes
      </button>
      <button className="btn" onClick={() => props.onCancel()}>
        No
      </button>
    </div>
  )
}

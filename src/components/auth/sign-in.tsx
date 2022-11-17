import {
  AuthCredential,
  AuthError,
  AuthProvider,
  browserPopupRedirectResolver,
  browserSessionPersistence,
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  getAdditionalUserInfo,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  TwitterAuthProvider,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth'
import { useContext, useState } from 'react'
import Image from 'src/components/image'
import { FirebaseContext } from 'src/pages/blog/[...blog]'
import { ButtonIcon } from '../common/icon'
import { AuthContext } from './auth-context-provider'
import MergeAccountsAction from './merge-accounts-action'

export type AuthProviderFn =
  | typeof GithubAuthProvider
  | typeof FacebookAuthProvider
  | typeof TwitterAuthProvider

function getCredential(prov: AuthProvider, err: AuthError) {
  switch (prov.providerId) {
    case FacebookAuthProvider.PROVIDER_ID:
      return FacebookAuthProvider.credentialFromError(err)
    case GithubAuthProvider.PROVIDER_ID:
      return GithubAuthProvider.credentialFromError(err)
    case GoogleAuthProvider.PROVIDER_ID:
      return GoogleAuthProvider.credentialFromError(err)
    case TwitterAuthProvider.PROVIDER_ID:
      return TwitterAuthProvider.credentialFromError(err)
    default:
      return null
  }
}

export const supportedPopupSignInMethods: Record<string, AuthProviderFn> = [
  GithubAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GoogleAuthProvider,
].reduce((acc, el) => ({ ...acc, [el.PROVIDER_ID]: el }), {})

export function UserImage({ user }: { user: Partial<User> }) {
  const photoURL = user.photoURL ?? '/no_profile_image.jpeg'
  return (
    <Image
      style={{ margin: '0.5em' }}
      alt={`${user.displayName}'s image`}
      src={photoURL}
      width="45px"
      height="45px"
    />
  )
}

export default function SignInScreen({
  onLogin,
  onLogout,
}: {
  slug: string
  onLogin?: (user: UserCredential) => void
  onLogout?: () => void
}) {
  const [needsToLink, setNeedsToLink] = useState<{
    email: string
    existingProvider: AuthProviderFn
    newProvider: AuthProvider
    credential: AuthCredential
  } | null>(null)

  const firebase = useContext(FirebaseContext)
  if (!firebase) {
    return <></>
  }

  //   function addUser(user: User, additionalData: AdditionalUserInfo) {
  //     console.log('Adding user info')
  //     if (firebase.db) {
  //       const db: Firestore = firebase.db
  //       const usersCollection: CollectionReference<DocumentData> = collection(
  //         db,
  //         DB_NAME,
  //         slug.replace(/\//gi, '-'),
  //         'users'
  //       )
  //       console.log({ usersCollection, data: { user, additionalData } })
  //       return addDoc(usersCollection, { user, additionalData })
  //     }
  //     console.log('No firebase')
  //   }

  if (needsToLink) {
    return (
      <MergeAccountsAction
        {...needsToLink}
        onMerge={(cred) => {
          onLogin?.(cred)
          setNeedsToLink(null)
        }}
        onCancel={() => {
          setNeedsToLink(null)
        }}
      />
    )
  }

  return (
    <AuthContext.Consumer>
      {(userState) => {
        const popup = async (provider: AuthProvider) => {
          const auth = getAuth(firebase.app)
          await auth.setPersistence(browserSessionPersistence)
          return signInWithPopup(auth, provider, browserPopupRedirectResolver)
            .then((result) => {
              const userInfo = getAdditionalUserInfo(result)
              //   if (result.user && userInfo) {
              //     addUser(result.user, userInfo)
              //   }

              onLogin?.(result)

              interface Profile {
                profile_image_url_https?: string
                avatar_url?: string
                picture?: {
                  data: {
                    url: string
                  }
                }
              }

              const profile: Profile = userInfo?.profile ?? {}
              const photoURL =
                profile['profile_image_url_https'] ??
                profile['avatar_url'] ??
                profile?.picture?.data?.url ??
                ''

              console.log({ photoURL })

              return updateProfile(result.user, {
                photoURL,
              })
              //   userState.setUserCredential(result)
            })
            .then((data) => {
              console.log({ data })
              return data
            })
            .catch(async (err: AuthError) => {
              if (
                err.customData?.email &&
                err.code === 'auth/account-exists-with-different-credential'
              ) {
                const providers = await fetchSignInMethodsForEmail(
                  getAuth(firebase.app),
                  (err.customData?.email as string) ?? ''
                )

                const firstPopupProviderMethod = providers.find(
                  (p) => supportedPopupSignInMethods[p]
                )

                // Test: Could this happen with email link then trying social provider?
                if (!firstPopupProviderMethod) {
                  throw new Error(
                    `Your account is linked to a provider that isn't supported.`
                  )
                }

                const linkedProvider =
                  supportedPopupSignInMethods[firstPopupProviderMethod]
                const credential = getCredential(provider, err)
                if (!credential) {
                  return
                }

                setNeedsToLink({
                  email: err.customData.email ?? '',
                  existingProvider: linkedProvider,
                  newProvider: provider,
                  credential,
                })
                return
              }

              // Handle errors...
              // toast.error(err.message || err.toString());

              console.log(err)
            })
        }
        const { user } = userState
        if (!user) {
          return (
            <div className="signin-icons">
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span>Please sign-in to comment:</span>
                <ButtonIcon
                  network="github"
                  onClick={() => {
                    const provider = new GithubAuthProvider()
                    popup(provider)
                  }}
                ></ButtonIcon>
                <ButtonIcon
                  network="facebook"
                  onClick={() => {
                    const provider = new FacebookAuthProvider()
                    popup(provider)
                  }}
                ></ButtonIcon>
                <ButtonIcon
                  network="twitter"
                  onClick={() => {
                    const provider = new TwitterAuthProvider()
                    popup(provider)
                  }}
                ></ButtonIcon>
                <ButtonIcon
                  network="google"
                  onClick={() => {
                    const provider = new GoogleAuthProvider()
                    popup(provider)
                  }}
                ></ButtonIcon>
              </span>
              <span>
                or you can{' '}
                <a href="mailto:pedro.f.marquez.soto@gmail.com">
                  send me an email
                </a>
              </span>
            </div>
          )
        }

        // const userInfo = getAdditionalUserInfo(credential)
        // console.log({ credential, userInfo })

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserImage user={user} />
            <span style={{ marginLeft: '0.5em' }} className="username">
              {user.displayName}
            </span>
            <button
              className="btn"
              onClick={async () => {
                await getAuth(firebase.app).signOut()
                // userState.clearUser()
                window.localStorage.removeItem('user')
                onLogout?.()
              }}
            >
              Logout
            </button>
          </div>
        )
      }}
    </AuthContext.Consumer>
  )
}

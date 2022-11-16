import {
  AdditionalUserInfo,
  getAdditionalUserInfo,
  getAuth,
  OperationType,
  User,
} from 'firebase/auth'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { FirebaseContext } from 'src/pages/blog/[...blog]'

export class UserState {
  user: User | null
  userInfo: AdditionalUserInfo | null

  constructor(user: User | null, userInfo: AdditionalUserInfo | null) {
    this.user = user
    this.userInfo = userInfo
  }
}

export const AuthContext = React.createContext<UserState>(
  new UserState(null, null)
)

function getUserState(user: User | null) {
  if (user?.providerId) {
    const additionalData = getAdditionalUserInfo({
      user,
      providerId:
        user.providerData.find((p) => p.providerId)?.providerId ?? null,
      operationType: OperationType.SIGN_IN,
    })
    return new UserState(user, additionalData)
  }
  return new UserState(user, null)
}

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode
}): ReactElement {
  const firebase = useContext(FirebaseContext)
  const auth = getAuth(firebase.app)
  const [user, setUser] = useState(() => {
    const user = auth.currentUser
    return getUserState(user)
  })

  useEffect(() => {
    auth.onAuthStateChanged((firebaseUser) => {
      setUser(getUserState(firebaseUser))
    })
  }, [auth])

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

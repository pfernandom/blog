'use client'

import React, { useState } from 'react'
import { FirebaseApp, FirebaseOptions } from 'firebase/app'
import { Firestore } from 'firebase/firestore'
import { getFirebase } from 'app/firebase'
import ErrorBoundary from 'app/_components/error-boundary'
import AuthContextProvider from 'app/_components/auth/auth-context-provider'
import BlogPostComments from 'app/_components/blog-post/blog-comments/blog-post-comments'

export const FirebaseContext = React.createContext<{
  app?: FirebaseApp
  db?: Firestore
}>({})

export default function PageComments({
  slug,
  firebaseConfig,
}: {
  slug: string
  firebaseConfig: FirebaseOptions
}) {
  const [firebase] = useState(getFirebase(firebaseConfig))

  return (
    <ErrorBoundary fallbackComponent={<></>}>
      <FirebaseContext.Provider value={firebase}>
        <AuthContextProvider>
          <BlogPostComments slug={slug} />
        </AuthContextProvider>
      </FirebaseContext.Provider>
    </ErrorBoundary>
  )
}

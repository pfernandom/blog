/* eslint-disable no-var */
// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseOptions } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
} from 'firebase/firestore'
///import { getAnalytics } from "firebase/analytics";

export function getFirebase(firebaseConfig: FirebaseOptions) {
  // const app = initializeApp(process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATOR === "true"? devFirebaseConfig : firebaseConfig, process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATOR === "true"?"dev" : 'blog');
  const app = initializeApp(firebaseConfig, 'blog')

  const db: Firestore = getFirestore(app)

  try {
    if (process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATOR === 'true') {
      connectFirestoreEmulator(db, 'localhost', 8080)
      connectAuthEmulator(getAuth(app), 'http://127.0.0.1:9099')
    }
  } catch (err) {
    console.log('already connected')
  }
  return { db, app }
}

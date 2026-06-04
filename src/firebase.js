import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCyGXVfJ5bLAXKuZOLJiQk3VxmowDuQvr4",
  authDomain: "geoconnections-abb1a.firebaseapp.com",
  projectId: "geoconnections-abb1a",
  storageBucket: "geoconnections-abb1a.firebasestorage.app",
  messagingSenderId: "258472730642",
  appId: "1:258472730642:web:c549a6c07cf79ecb02b8cb"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

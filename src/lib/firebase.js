// src/lib/firebase.js
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseFallbackConfig = {
  apiKey: "AIzaSyDV_tBKRSLCvDAJTE05NqUtky95IVSKx6w",
  authDomain: "teklan-store.firebaseapp.com",
  projectId: "teklan-store",
  storageBucket: "teklan-store.appspot.com",
  messagingSenderId: "707175608067",
  appId: "1:707175608067:web:e2fc0283ef3285ed4f0336",
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseFallbackConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseFallbackConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseFallbackConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || firebaseFallbackConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || firebaseFallbackConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseFallbackConfig.appId,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const db = getFirestore(app);

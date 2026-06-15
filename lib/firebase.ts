// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUqsy8voqkxwH5-WKUS5XEyRFj1hF1sHE",
  authDomain: "bilingnus.firebaseapp.com",
  projectId: "bilingnus",
  storageBucket: "bilingnus.firebasestorage.app",
  messagingSenderId: "382034070428",
  appId: "1:382034070428:web:9c5dc269bf21d5ab291659",
  measurementId: "G-MY2GL914ZB"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;;
export const auth = getAuth(app);
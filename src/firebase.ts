// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAk3c7zsxuPkVm8oypX-k2rxG1R2gy6erM",
  authDomain: "poll-pilot-5545a.firebaseapp.com",
  projectId: "poll-pilot-5545a",
  storageBucket: "poll-pilot-5545a.appspot.com",
  messagingSenderId: "940992503741",
  appId: "1:940992503741:web:98bfd90f8ffd7536e8fcd4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
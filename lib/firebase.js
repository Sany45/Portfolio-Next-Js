// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFuVxPXGOmYiq04DdcsydSoFET6nhftSo",
  authDomain: "test-fire-access.firebaseapp.com",
  projectId: "test-fire-access",
  storageBucket: "test-fire-access.firebasestorage.app",
  // messagingSenderId: "44394012724",
  appId: "1:44394012724:web:51ba8ad7a3a34d00feea61",
  measurementId: "G-F1RQYTCTV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)


export { db, auth }

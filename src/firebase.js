// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxYltZ53z0tDJ8HmC28BMGSSmfI1mMTkc",
  authDomain: "clone-insta-b0c9a.firebaseapp.com",
  databaseURL: "https://clone-insta-b0c9a-default-rtdb.firebaseio.com",
  projectId: "clone-insta-b0c9a",
  storageBucket: "clone-insta-b0c9a.firebasestorage.app",
  messagingSenderId: "745428708928",
  appId: "1:745428708928:web:a72e17852ad42bbcebb9a5",
  measurementId: "G-3V2772RFB2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);

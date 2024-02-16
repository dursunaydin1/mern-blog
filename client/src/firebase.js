// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-bbe9b.firebaseapp.com",
  projectId: "mern-blog-bbe9b",
  storageBucket: "mern-blog-bbe9b.appspot.com",
  messagingSenderId: "339158811846",
  appId: "1:339158811846:web:32da8860a2cba3ef0d43c7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

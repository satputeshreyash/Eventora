// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-d4e5c.firebaseapp.com",
  projectId: "mern-blog-d4e5c",
  storageBucket: "mern-blog-d4e5c.appspot.com",
  messagingSenderId: "155577694679",
  appId: "1:155577694679:web:e534b1e76689faa4c5b392"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


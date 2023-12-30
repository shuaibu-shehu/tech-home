// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-7e7d3.firebaseapp.com",
  projectId: "mern-auth-7e7d3",
  storageBucket: "mern-auth-7e7d3.appspot.com",
  messagingSenderId: "390520214298",
  appId: "1:390520214298:web:bf44d746c2d15d7a8bd2a3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
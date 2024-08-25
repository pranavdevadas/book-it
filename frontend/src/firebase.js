// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "bookit-5cd7b.firebaseapp.com",
  projectId: "bookit-5cd7b",
  storageBucket: "bookit-5cd7b.appspot.com",
  messagingSenderId: "985724704013",
  appId: "1:985724704013:web:136f4001ee98be531acc44"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
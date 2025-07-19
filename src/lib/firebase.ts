// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAV7ANo8Do49S6_L2SC10Ni-3CyyJKl0_U",
  authDomain: "pandeypatel-protocol.firebaseapp.com",
  projectId: "pandeypatel-protocol",
  storageBucket: "pandeypatel-protocol.firebasestorage.app",
  messagingSenderId: "141440160156",
  appId: "1:141440160156:web:798a1784b8865fceee7859"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;

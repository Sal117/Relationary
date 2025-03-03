// Import the Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAhDaI4PO8UvVI33stIPGVd_Gb-NjRBlYw",
    authDomain: "demorndteam.firebaseapp.com",
    projectId: "demorndteam",
    storageBucket: "demorndteam.firebasestorage.app",
    messagingSenderId: "74896391072",
    appId: "1:74896391072:web:f497e04fde21657bb302c5",
    measurementId: "G-HPJJ6PY66R"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Export services to use them in other files
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
export {}; 

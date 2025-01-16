import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8mhBarsNeDa535PNcIu4dvxy4E97mI0Q",
  authDomain: "serp-database-91651.firebaseapp.com",
  projectId: "serp-database-91651",
  storageBucket: "serp-database-91651.firebasestorage.app",
  messagingSenderId: "725054831647",
  appId: "1:725054831647:web:5f0f5b8ff14ff3ba29692a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
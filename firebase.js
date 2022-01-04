// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwZM09_o-t3I3v3L81KaI6rh2MS6W_vrY",
  authDomain: "playbuddies-fb6ea.firebaseapp.com",
  projectId: "playbuddies-fb6ea",
  storageBucket: "playbuddies-fb6ea.appspot.com",
  messagingSenderId: "270325363163",
  appId: "1:270325363163:web:54b6fae41ad5cc0256f7fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
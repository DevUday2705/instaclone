// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlJc5lhzp0bfHptWMlfsXREH2aGnird8o",
  authDomain: "instagramclone-574dd.firebaseapp.com",
  projectId: "instagramclone-574dd",
  storageBucket: "instagramclone-574dd.appspot.com",
  messagingSenderId: "675133997962",
  appId: "1:675133997962:web:50147306e299c753967e73",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

export { app, db, auth, storage };

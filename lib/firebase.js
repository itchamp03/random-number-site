// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhL0iIq0lAZThJxguUMFItvFZmhgMcveg",
  authDomain: "fake-stock-ticker.firebaseapp.com",
  projectId: "fake-stock-ticker",
  storageBucket: "fake-stock-ticker.firebasestorage.app",
  messagingSenderId: "1012202975734",
  appId: "1:1012202975734:web:513fc067e4de647b9a97d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
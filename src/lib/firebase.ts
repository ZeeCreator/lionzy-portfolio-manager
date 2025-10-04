// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrrRGy0O_wTFzHfQcIVdPl-irxN9FRofU",
  authDomain: "zeep-e0125.firebaseapp.com",
  databaseURL: "https://zeep-e0125-default-rtdb.firebaseio.com",
  projectId: "zeep-e0125",
  storageBucket: "zeep-e0125.appspot.com",
  messagingSenderId: "434651632957",
  appId: "1:434651632957:web:d7a0bf2272a76f5cd4e154"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

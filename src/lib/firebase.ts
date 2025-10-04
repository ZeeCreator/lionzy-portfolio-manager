// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

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
let app;
let database;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase. Please check your configuration and ensure the Realtime Database is enabled.');
}

export { database };

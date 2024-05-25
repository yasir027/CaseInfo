// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVm3o8QDUXe1OEMPGRth5N-AXSeiWVoSo",
  authDomain: "caseinfo-39b64.firebaseapp.com",
  projectId: "caseinfo-39b64",
  storageBucket: "caseinfo-39b64.appspot.com",
  messagingSenderId: "51526270971",
  appId: "1:51526270971:web:9df5440e27530e75dd955e",
  measurementId: "G-0EWSHLEV0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize auth service
const db = getFirestore(app); // Initialize Firestore


export { auth, db }; // Export auth and db services

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA4Pab2IPxNebAZy9S4AdxdD3dw5JDu_vs",
  authDomain: "ecommerce-logan-ee1e8.firebaseapp.com",
  projectId: "ecommerce-logan-ee1e8",
  storageBucket: "ecommerce-logan-ee1e8.appspot.com",
  messagingSenderId: "400221565522",
  appId: "1:400221565522:web:1194c060e40d3cd06ae58b",
  measurementId: "G-09N96RH8KC"
};

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();
const analytics = getAnalytics();

export { auth, db, storage, analytics };

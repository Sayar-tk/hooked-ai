// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5JQwGaGZwtCbc9YR4OU_F8NzF1LTcDPA",
  authDomain: "outlier-project.firebaseapp.com",
  projectId: "outlier-project",
  storageBucket: "outlier-project.firebasestorage.app",
  messagingSenderId: "632305594805",
  appId: "1:632305594805:web:736173e1dfa01fc51229fc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
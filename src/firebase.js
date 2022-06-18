import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyD4MkZjf_CzvvD1fREYnkkPFtdj0a6zxn0",

  authDomain: "sella-telegram.firebaseapp.com",

  projectId: "sella-telegram",

  storageBucket: "sella-telegram.appspot.com",

  messagingSenderId: "58261241631",

  appId: "1:58261241631:web:d95a081e0568129e007a2a",

  measurementId: "G-FCE0Y44MRF",
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();
export default firebase;

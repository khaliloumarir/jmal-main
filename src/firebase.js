import firebase from 'firebase/app';
import "firebase/firestore"
import "firebase/auth"
const firebaseConfig = ({
  apiKey: "AIzaSyCUDnK9SxDVRxnKOvzmaJl_-S11r3pjckM",
  authDomain: "auth-development-b55c9.firebaseapp.com",
  projectId: "auth-development-b55c9",
  storageBucket: "auth-development-b55c9.appspot.com",
  messagingSenderId: "651476036360",
  appId: "1:651476036360:web:4310e909f725aff5c5dabd"
})

firebase.initializeApp(firebaseConfig);
firebase.firestore()
export default firebase

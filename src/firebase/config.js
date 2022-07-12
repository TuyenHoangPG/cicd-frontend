import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsTPhPtD453K3vYrMWSreC1mDv3ZlOEfw",
  authDomain: "chat-app-b97b6.firebaseapp.com",
  projectId: "chat-app-b97b6",
  storageBucket: "chat-app-b97b6.appspot.com",
  messagingSenderId: "379155265353",
  appId: "1:379155265353:web:d932cab9e24d428123cc98",
  measurementId: "G-Y9SRZH03D7",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

if (window.location.hostname === "localhost") {
  auth.useEmulator("http://localhost:9099");
  db.useEmulator("localhost", "8080");
}

export { db, auth };
export default firebase;

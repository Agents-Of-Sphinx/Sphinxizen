import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC5higEAoRWVCjw1umDur6hjih0gsmcctg",
  authDomain: "sphinx-fd2ab.firebaseapp.com",
  projectId: "sphinx-fd2ab",
  storageBucket: "sphinx-fd2ab.appspot.com",
  messagingSenderId: "280069928728",
  appId: "1:280069928728:web:c05b91c59a98e1e81b106d",
  measurementId: "G-03QM30LL2M"
};

firebase.initializeApp(firebaseConfig);



const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const auth = firebase.auth();

export { firebase, auth, storage, analytics };
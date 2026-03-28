
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC5higEAoRWVCjw1umDur6hjih0gsmcctg",
  authDomain: "sphinx-fd2ab.firebaseapp.com",
  projectId: "sphinx-fd2ab",
  storageBucket: "sphinx-fd2ab.appspot.com",
  messagingSenderId: "280069928728",
  appId: "1:280069928728:web:c05b91c59a98e1e81b106d",
  measurementId: "G-03QM30LL2M"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;

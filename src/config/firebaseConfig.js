import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCJp9-nYtERAaJLcspbM5uDNvGMonpcuYw",
  authDomain: "redunab.firebaseapp.com",
  projectId: "redunab",
  storageBucket: "redunab.appspot.com",
  messagingSenderId: "80591109112",
  appId: "1:80591109112:web:a327af8be90ee7ed33f40d",
  measurementId: "G-6BFWFN53BP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, db, storage };

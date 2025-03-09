
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'; // still keeping firestore import, might be used later or remove if completely unused

const firebaseConfig = {
  apiKey: "AIzaSyCc4Zzr1q4-mKp1IFltTO1hJFS_fpHZxxk",
  authDomain: "brgy-san-antonio-its122l.firebaseapp.com",
  projectId: "brgy-san-antonio-its122l",
  storageBucket: "brgy-san-antonio-its122l.firebasestorage.app",
  messagingSenderId: "505564118785",
  appId: "1:505564118785:web:dc2cb8d8fa7045a3c7a500"
};

// initialize firebase
const app = initializeApp(firebaseConfig);
const authInstance = getAuth(app); // renamed to authinstance to avoid confusion with backend auth
const db = getFirestore(app); // keeping db initialization in case firestore is still needed

export { authInstance as auth, db }; // export authinstance as 'auth' to keep existing imports working, and db if needed.
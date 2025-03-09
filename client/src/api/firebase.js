
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'; // still keeping firestore import, might be used later or remove if completely unused

const firebaseConfig = {
  apiKey: "AIzaSyBRCe6TgKSTe3Liem329Vcy1x_56vkRRHQ",
  authDomain: "barangay-info-its120l.firebaseapp.com",
  projectId: "barangay-info-its120l",
  storageBucket: "barangay-info-its120l.firebasestorage.app",
  messagingSenderId: "738641037249",
  appId: "1:738641037249:web:3d4b44dbcce3e8d0185140"
};

// initialize firebase
const app = initializeApp(firebaseConfig);
const authInstance = getAuth(app); // renamed to authinstance to avoid confusion with backend auth
const db = getFirestore(app); // keeping db initialization in case firestore is still needed

export { authInstance as auth, db }; // export authinstance as 'auth' to keep existing imports working, and db if needed.
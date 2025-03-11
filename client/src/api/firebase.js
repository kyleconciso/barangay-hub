import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // still keeping firestore import, might be used later or remove if completely unused
import { firebaseConfig } from "./config";

// initialize firebase
const app = initializeApp(firebaseConfig);
const authInstance = getAuth(app); // renamed to authinstance to avoid confusion with backend auth
const db = getFirestore(app); // keeping db initialization in case firestore is still needed

export { authInstance as auth, db }; // export authinstance as 'auth' to keep existing imports working, and db if needed.

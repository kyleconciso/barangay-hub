import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRCe6TgKSTe3Liem329Vcy1x_56vkRRHQ",
  authDomain: "barangay-info-its120l.firebaseapp.com",
  projectId: "barangay-info-its120l",
  storageBucket: "barangay-info-its120l.firebasestorage.app",
  messagingSenderId: "738641037249",
  appId: "1:738641037249:web:3d4b44dbcce3e8d0185140"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
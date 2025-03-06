import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; 

// Import Firebase client-side SDK and initialize it 
import { initializeApp } from "firebase/app";

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
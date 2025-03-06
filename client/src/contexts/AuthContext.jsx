// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { getToken, removeToken, setToken } from '../utils/storage';
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import from Firebase client SDK

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Loading

  useEffect(() => {
    const auth = getAuth(); //  getAuth() here
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true); // Set loading to true when auth state changes
      if (firebaseUser) {
        try{
          const idToken = await firebaseUser.getIdToken();
          setToken(idToken)
          const userProfile = await authService.getProfile();
          setUser(userProfile.data.user);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
          setIsLoggedIn(false);
          removeToken();
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
        removeToken();
      }
      setLoading(false); // Set loading to false after auth state is resolved
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  const logout = () => {
    const auth = getAuth(); // Use getAuth() for signout too
    auth.signOut().then(() => {
      removeToken();
      setUser(null);
      setIsLoggedIn(false);
    }).catch((error) => {
      //handle sign-out errors
    })

  };

  const contextValue = {
    user,
    isLoggedIn,
    loading, // Expose loading state
    login: () => {}, // Placeholder actual login is handled in Login.jsx
    logout,
    setUser, // Expose setUser
    setIsLoggedIn, // Expose setIsLoggedIn
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
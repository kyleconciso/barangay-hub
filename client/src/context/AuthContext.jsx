// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true); // New state variable

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // set Authorization header for all axios requests
          const idToken = await user.getIdToken();
          axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;

          // only fetch profile if NOT the initial load ***
          if (!initialLoad) {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/profile`);
            setCurrentUser(response.data.data.user);
          }

        } catch (error) {
          console.error("Error fetching user profile:", error);
          setCurrentUser(null); // Still set to null on error
        }
      } else {
        setCurrentUser(null);
        delete axios.defaults.headers.common["Authorization"];
      }
        setLoading(false);
        setInitialLoad(false) //  initial load is complete
    });

    return unsubscribe;
  }, [initialLoad]); // Depend on initialLoad

    const value = {
        currentUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
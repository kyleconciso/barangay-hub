import React, { createContext, useState, useEffect } from "react";
import { auth } from "../api/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { me as fetchMe, register } from "../api/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setUserType("GUEST");
        setLoading(false);
      } else {
        try {
          const userData = await fetchMe();
          setUser(firebaseUser);
          setUserType(userData.type);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(firebaseUser);
        } finally {
          setLoading(false);
        }
      }
    });

    return unsubscribe;
  }, []);

  const signup = (userData) => {
    return register(userData);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // redirect to login after logout
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    user,
    userType,
    signup,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

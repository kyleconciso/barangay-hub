
import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser, logout as apiLogout } from '../src/api/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // init loading state
  const navigate = useNavigate();

  // check existing token
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          //  verify
          const userData = await getCurrentUser(); //  API call
          setUser(userData.user);
        }
      } catch (error) {
        //  token invalid/error
        localStorage.removeItem('authToken'); // Clear invalid token
        setUser(null);

      } finally {
        setLoading(false); // false loading
      }
    };

    checkAuthStatus();
  }, []);


  const login = async (credentials) => {
    const data = await apiLogin(credentials); // API call
    localStorage.setItem('authToken', data.user.id); // store token
    setUser(data.user); // update context
  };

  const register = async (userData) => {
    const data = await apiRegister(userData); // API call
     //login after register
     await login({email: userData.email, password: userData.password});
  };

  const logout = async () => {
    await apiLogout();
    localStorage.removeItem('authToken');
    setUser(null);
    navigate("/login"); //redirect
  };

  const authContextValue = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


//custom hook
export const useAuth = () => useContext(AuthContext);
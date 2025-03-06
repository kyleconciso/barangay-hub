// src/services/auth.service.js
import { auth } from '../firebase';
import {  signInWithEmailAndPassword, signOut } from 'firebase/auth'; // Removed createUserWithEmailAndPassword
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const signUp = async (email, password, firstName, lastName, phone, address) => {
    try {

        const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
            email,
            password,
            firstName,
            lastName,
            phone,
            address,
        });

        return response.data.data; 
    } catch (error) {
        // Axios wraps the error.  Access the message correctly.
        if (error.response) {
            // Server responded with an error status code
            throw new Error(error.response.data.message || "Server error during signup.");
        } else if (error.request) {
            // Request was made, but no response received
            throw new Error("No response from server during signup.");
        } else {
            // Something else happened
            throw new Error(error.message || "An error occurred during signup.");
        }
    }
};

export const signIn = async (email, password) => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await user.getIdToken();
        await axios.post(`${API_BASE_URL}/auth/signin`, { email, password });
        return user;
    } catch (error) {
        // Handle Firebase Authentication errors nicely:
        if (error.code === 'auth/invalid-email' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          throw new Error('Invalid email or password. Please try again.');
        } else {
          throw new Error(error.message || 'An error occurred during sign-in.');
        }
    }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message || 'An error occurred during sign-out.'); // Consistent error messages
  }
};


export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`);
    return response.data.data.user;
  } catch (error) {
      if (error.response) {
          throw new Error(error.response.data.message || "Server error while fetching profile.");
      } else if (error.request) {
          throw new Error("No response from server while fetching profile.");
      } else {
          throw new Error(error.message || "An error occurred while fetching profile.");
      }
  }
}


const authService = { signUp, signIn, signOutUser, getUserProfile };
export default authService;
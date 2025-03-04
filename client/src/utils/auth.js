
// save the token to localStorage
export const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  };
  
  //  get token
  export const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };
  
  // remove token
  export const removeAuthToken = () => {
      return localStorage.removeItem('authToken');
  }
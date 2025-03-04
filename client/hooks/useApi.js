
import { useState, useCallback } from 'react';

const useApi = (apiFunc) => { // recv api func
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (...args) => { // useCallback memmoization
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...args); // call api
      setData(result);
      return result; // return
    } catch (err) {
      setError(err || 'something went wrong');
      throw err; // rethrow
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, loading, error, request };
};

export default useApi;
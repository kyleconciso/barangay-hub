import { useState, useCallback } from 'react';

export const useApi = (apiFunc, ...initialArgs) => { // accepts initial arguments
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => { // accepts arguments for the api call
    setLoading(true);
    setError(null);
    try {
      // use initialargs if no arguments are provided, otherwise use the provided args
      const actualArgs = args.length > 0 ? args : initialArgs;
      const result = await apiFunc(...actualArgs);
      setData(result);
      return result; // return the result for the caller to use
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunc, initialArgs]);

  return { data, loading, error, execute };
};
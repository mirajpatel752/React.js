import { useCallback, useEffect, useState } from "react";

export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState("idle");
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (data = {}) => {
    setStatus("pending");
    setValue(null);
    setError(null);
    try {
      let response = await asyncFunction(data);
      setValue(response);
      setStatus("success");
    } catch (error) {
      setError(error);
      setValue(error.response);
      setStatus("error");
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  return { execute, status, value, error };
};

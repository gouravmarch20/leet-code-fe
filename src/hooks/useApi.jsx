import { useState, useCallback } from "react";

export const useApi = (baseUrl) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const request = async (endpoint, methord, body, headers) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        methord,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "API request failed");
      }

      const result = await response.json().catch(() => null);
      setData(result);
      return result;
    } catch (error) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  const get = useCallback(
    (endpoint, headers) => request(endpoint, "GET", null, headers),
    [request]
  );
  return { get };
};

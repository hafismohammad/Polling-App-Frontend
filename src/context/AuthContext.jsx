/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";

const authContext = createContext();

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <authContext.Provider value={{ token, setToken }}>
      {children}
    </authContext.Provider>
  );
};

export { authContext, AuthProvider };

import { useContext, useEffect, useState } from "react";
import { authContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const Auth = () => {
  const { token } = useContext(authContext);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsLoading(false); 
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default Auth;

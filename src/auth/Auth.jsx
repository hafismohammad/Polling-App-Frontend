import { useContext } from "react";
import { authContext } from "../context/AuthContext";
import {   Outlet, useNavigate } from "react-router-dom";

const Auth = () => {
  const { token } = useContext(authContext);
   const navigae = useNavigate()
   console.log('token', token);
   
  if (token === null) {
    navigae('/login')
  }

  // return token ? <Outlet /> : <Navigate to="/login"/>;
  return  <Outlet /> 
};

export default Auth;

import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  // const url ="https://backend.rdvision.tech"
  const url ="http://localhost:8080"
  const token =localStorage.getItem("loginDetails")?JSON.parse(localStorage.getItem("loginDetails")).token:""
  return (
    <AuthContext.Provider value={{ isDisabled, setIsDisabled,url,token}}>
      {children}
    </AuthContext.Provider>

  );
};

export const useAuth = () => useContext(AuthContext);

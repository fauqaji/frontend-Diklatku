// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

// Buat AuthContext
export const AuthContext = createContext();

// Provider untuk AuthContext
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cek token di localStorage untuk menentukan status login
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Login jika token ada
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook untuk menggunakan AuthContext
export const useAuth = () => useContext(AuthContext);

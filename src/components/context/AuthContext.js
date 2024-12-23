import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Inisialisasi useNavigate

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Jika ada token, cek apakah token expired
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Token expired
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/login-page"); // Arahkan ke halaman login jika token expired
      } else {
        setIsLoggedIn(true);
        const timeout = (decoded.exp - currentTime) * 1000;
        const timer = setTimeout(() => {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          navigate("/login-page"); // Arahkan ke halaman login setelah token expired
        }, timeout);

        return () => clearTimeout(timer);
      }
    } else {
      // Jika tidak ada token, biarkan isLoggedIn tetap false tanpa redirect
      setIsLoggedIn(false);
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

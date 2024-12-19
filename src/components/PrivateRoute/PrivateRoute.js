import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Pastikan path sesuai
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Tambahkan gaya default toastify

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth(); // Ambil status login dari context
  const [loading, setLoading] = useState(true); // Untuk menangani status loading saat mengecek token

  useEffect(() => {
    // Mengecek token saat aplikasi dimuat
    const token = localStorage.getItem("token"); // Atau gunakan sessionStorage
    if (token) {
      // Validasi token jika diperlukan (misalnya dengan API request)
      setIsLoggedIn(true);
    }
    setLoading(false); // Set loading ke false setelah pengecekan token
  }, [setIsLoggedIn]);

  if (loading) {
    return <div>Loading...</div>; // Tampilkan loading sementara saat pengecekan
  }

  if (!isLoggedIn) {
    toast.warning("Login lebih dulu", { autoClose: 3000 }); // Munculkan toast warning
    return <Navigate to="/login-page" replace />;
  }

  return children;
};

export default PrivateRoute;

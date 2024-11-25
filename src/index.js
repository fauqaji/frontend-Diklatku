import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/bootstrap.min.css";
import "./assets/scss/now-ui-kit.scss?v=1.5.0";
import "./assets/demo/demo.css?v=1.5.0";
import "./assets/demo/nucleo-icons-page-styles.css?v=1.5.0";
// pages for this kit
import Index from "./views/Index.js";
import LoginPage from "./views/examples/LoginPage.js";
import Dashboard from "./components/Monitoring/Dashboard";
import GedungA from "./views/Buildings/Gedung_A.js";
import GedungB from "./views/Buildings/Gedung_B.js";
import AreaC from "./views/Buildings/AreaC.js";
import PemesananRuang from "./views/PemesananRuang/PemesananRuang.js";
// import DetailService from "./views/DetailService/DetailService.js";
import DetailServiceUpdate from "./components/UpdateDS/DetailServiceUpdate.js";
import { AuthProvider } from "./components/context/AuthContext"; // Path sesuai dengan lokasi AuthContext

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gedungA" element={<GedungA />} />
        <Route path="/gedungB" element={<GedungB />} />
        <Route path="/areaC" element={<AreaC />} />
        <Route path="/pemesanan-ruang" element={<PemesananRuang />} />
        <Route path="/detail-update/:id" element={<DetailServiceUpdate />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoPemkot from "../../assets/img/logo-pemkot.png";
import allbuilding from "../../assets/img/uim_apps.png";
import beranda from "../../assets/img/beranda.png";
import gedung from "../../assets/img/gedung.png";
import lainnya from "../../assets/img/lainnya.png";
import book from "../../assets/img/book.png";
import {
  Container,
  Button,
  SlickBar,
  LogoContainer,
  Logo,
  LogoText,
  Item,
  Img,
  Text,
  Logout,
} from "../styledComponent/sidebar";
import Tooltip from "../styledComponent/tooltip"; // Import Tooltip yang baru dibuat
import "./sidebar.css";

const Sidebar = () => {
  const [click, setClick] = useState(false);
  const [tooltipActive, setTooltipActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Cek apakah token ada di localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // Jika token ada, set isLoggedIn ke true
    }
  }, []);

  const handleClick = () => setClick(!click);

  // Fungsi handleLogout untuk logout
  const handleLogout = () => {
    // Hapus token atau data session
    localStorage.removeItem("token"); // Contoh: hapus token dari localStorage
    setIsLoggedIn(false);
    // Arahkan pengguna ke halaman login
    navigate("/");
  };

  return (
    <Container>
      <Button clicked={click ? "true" : false} onClick={handleClick} />
      <SlickBar clicked={click ? "true" : false}>
        <LogoContainer>
          <Logo>
            <img src={logoPemkot} alt="Logo Pemkot" />
          </Logo>
          <LogoText clicked={click}>
            <h1>ASRAMA BALAI DIKLAT</h1>
            <h2>Kota Semarang</h2>
          </LogoText>
        </LogoContainer>

        {/* Item Beranda */}
        <Item
          isActive={location.pathname === "/"}
          onClick={() => navigate("/")}
        >
          <Img src={beranda} alt="beranda" />
          <Text clicked={click ? "true" : false}>Beranda</Text>
        </Item>

        {/* Item Semua Ruang */}
        <Item
          isActive={location.pathname === "/dashboard"}
          onClick={() => navigate("/dashboard")}
        >
          <Img src={allbuilding} alt="all" />
          <Text clicked={click ? "true" : false}>
            Gedung & Status Ruang
          </Text>
        </Item>

        {isLoggedIn && (
          <Item
            isActive={location.pathname === "/pemesanan-ruang"}
            onClick={() => navigate("/pemesanan-ruang")}
          >
            <Img src={book} alt="Book" />
            <Text clicked={click ? "true" : false}>Pemesanan Ruang</Text>
          </Item>
        )}

        {/* Item Gedung Asrama A */}
        <Item
          isActive={location.pathname === "/gedungA"}
          onClick={() => navigate("/gedungA")}
        >
          <Img src={gedung} alt="Gedung Asrama A" />
          <Text clicked={click ? "true" : false}>Gedung Asrama A</Text>
        </Item>

        {/* Item Gedung Asrama B */}
        <Item
          isActive={location.pathname === "/gedungB"}
          onClick={() => navigate("/gedungB")}
        >
          <Img src={gedung} alt="Gedung Asrama B" />
          <Text clicked={click ? "true" : false}>Gedung Asrama B</Text>
        </Item>

        {/* Item Lainnya */}
        <Item
          isActive={location.pathname === "/areaC"}
          onClick={() => navigate("/areaC")}
        >
          <Img src={lainnya} alt="Lainnya" />
          <Text clicked={click ? "true" : false}>Lainnya</Text>
        </Item>

        {/* Logout Button */}
        {isLoggedIn && ( // Tampilkan tombol logout hanya jika isLoggedIn true
          <Logout
            id="logout"
            onClick={handleLogout}
            onMouseEnter={() => setTooltipActive(true)}
            onMouseLeave={() => setTooltipActive(false)}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <Tooltip active={tooltipActive ? "true" : false}>
              Keluar
            </Tooltip>
          </Logout>
        )}
      </SlickBar>
    </Container>
  );
};

export default Sidebar;

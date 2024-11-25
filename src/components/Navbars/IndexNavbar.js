import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container,
  UncontrolledTooltip,
} from "reactstrap";

import "../../views/css/ind-nav.css"

function IndexNavbar() {
  const [navbarColor, setNavbarColor] = useState("navbar-transparent");
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const updateNavbarColor = () => {
      if (window.scrollY > 399) {
        setNavbarColor("bg-custom");
      } else {
        setNavbarColor("navbar-transparent");
      }
    };

    window.addEventListener("scroll", updateNavbarColor);
    updateNavbarColor();

    return () => {
      window.removeEventListener("scroll", updateNavbarColor);
    };
  }, []);

  // Cek token untuk menentukan status login
  useEffect(() => {
    const token = localStorage.getItem("token"); // Cek token
    setIsAdminLoggedIn(!!token); // Set status login
  }, []);

  return (
    <>
      {collapseOpen ? (
        <div
          id="bodyClick"
          onClick={() => {
            document.documentElement.classList.toggle("nav-open");
            setCollapseOpen(false);
          }}
        />
      ) : null}
      <Navbar className={"fixed-top " + navbarColor} expand="lg" color="danger">
        <Container>
          <div className="d-flex justify-content-between align-items-center w-100">
            <NavbarBrand href="/" id="navbar-brand">
              Sewa Balai Diklat
            </NavbarBrand>
            <UncontrolledTooltip target="#navbar-brand">
              biaya sewa dengan fasilitas yang sesuai
            </UncontrolledTooltip>

            <button
              className="navbar-toggler"
              onClick={() => {
                document.documentElement.classList.toggle("nav-open");
                setCollapseOpen(!collapseOpen);
              }}
              aria-expanded={collapseOpen}
              type="button"
            >
              <span className="navbar-toggler-bar top-bar"></span>
              <span className="navbar-toggler-bar middle-bar"></span>
              <span className="navbar-toggler-bar bottom-bar"></span>
            </button>

            <Collapse
              className="navbar-collapse"
              isOpen={collapseOpen}
              navbar
            >
              <Nav className="ml-auto nav-collap-ind side-coll-ind" navbar>
                <UncontrolledDropdown nav>
                  <DropdownToggle
                    caret
                    color="default"
                    href="#pablo"
                    nav
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fa-solid fa-building fa-lg"></i>{" "}
                    <p className="ml-2">Monitoring</p>
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem tag={Link} to="/dashboard">
                      <i className="fa-solid fa-circle-right"></i>
                      Semua Fasilitas
                    </DropdownItem>
                    <DropdownItem to="/gedungA" tag={Link}>
                      Gedung A
                    </DropdownItem>
                    <DropdownItem to="/gedungB" tag={Link}>
                      Gedung B
                    </DropdownItem>
                    <DropdownItem to="/areaC" tag={Link}>
                      Lainnya
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>

                <NavItem>
                  <Button
                    className="nav-link btn bg-custom"
                    tag={Link}
                    to={isAdminLoggedIn ? "/dashboard" : "/login-page"}
                  >
                    <i className={isAdminLoggedIn ? "fa-solid fa-user-tie" : "fa-solid fa-arrow-right-to-bracket"}></i>
                    <p className="ml-2">{isAdminLoggedIn ? "Admin" : "Login"}</p>
                  </Button>
                </NavItem>
              </Nav>
            </Collapse>
          </div>
        </Container>
      </Navbar>
    </>
  );
}

export default IndexNavbar;

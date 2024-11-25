/* eslint-disable */
import React from "react";
// reactstrap components
import { Container } from "reactstrap";
// Impor CSS
import "../../App.css";

function Footer() {
  return (
    <footer className="footer-cen" data-background-color="black">
      <Container className="text-center">
        <div className="copyright" id="copyright">
          © {new Date().getFullYear()}, Designed by
          {" All rights reserved | Made with ❤️ by BKPP Kota Semarang"}.
        </div>
      </Container>
    </footer>
  );
}

export default Footer;

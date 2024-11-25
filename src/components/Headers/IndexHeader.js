/*eslint-disable*/
import React from "react";
import "../../views/css/hero.css";
// reactstrap components
import { Container } from "reactstrap";
// core components

function IndexHeader() {
  let pageHeader = React.createRef();

  React.useEffect(() => {
    if (window.innerWidth > 991) {
      const updateScroll = () => {
        let windowScrollTop = window.pageYOffset / 3;
        pageHeader.current.style.transform =
          "translate3d(0," + windowScrollTop + "px,0)";
      };
      window.addEventListener("scroll", updateScroll);
      return function cleanup() {
        window.removeEventListener("scroll", updateScroll);
      };
    }
  });

  return (
    <>
      <div
        className="page-header clear-filter"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      >
        <div
          className="page-header-image"
          style={{
            backgroundImage:
              "url(" + require("../../assets/img/bg-bkpp.jpg") + ")",
          }}
          ref={pageHeader}
        ></div>
        <Container>
          <div className="content-center brand">
            <img
              alt="..."
              className="n-logo"
              src={require("../../assets/img/logo-pemkot.png")}
            ></img>
            <h3>BKPP Kota Semarang</h3>
            <button
              className="btn btn-lokasi"
              onClick={() =>
                window.open(
                  "https://maps.app.goo.gl/DzyViyVB9hBpEusY6",
                  "_blank"
                )
              }
            >
              <i className="fa-solid fa-location-dot"></i> Lokasi
            </button>
          </div>
          <h6
            className="category category-absolute"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <a
              href="https://www.instagram.com/bkppkotasemarang/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <i
                className="fa-brands fa-instagram"
                style={{
                  fontSize: "24px",
                  color: "#E1306C",
                  marginRight: "8px",
                }}
              ></i>
              <span style={{ color: "white" }}>BKPP Kota Semarang</span>
            </a>
            <a
              href="mailto:kotasemarang.bkpp@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <i
                className="fa-solid fa-envelope ml-2"
                style={{ fontSize: "24px", color: "red", marginRight: "8px" }}
              ></i>
              <span style={{ color: "white" }}>
                kotasemarang.bkpp@gmail.com
              </span>
            </a>
            <a
              href="https://wa.me/+62243586680"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <i
                className="fa-brands fa-whatsapp ml-2"
                style={{
                  fontSize: "24px",
                  color: "#25D366",
                  marginRight: "8px",
                }}
              ></i>
              <span style={{ color: "white" }}>
                (024) 358-66-80 / 673-13-98
              </span>
            </a>
          </h6>
        </Container>
      </div>
    </>
  );
}

export default IndexHeader;

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../css/deskImg.css";

function Images() {
  const [playAnimation, setPlayAnimation] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setPlayAnimation(true); // Memicu animasi ketika elemen muncul di viewport
          observer.unobserve(entry.target); // Hentikan pengamatan setelah animasi dipicu
        }
      },
      { threshold: 0.18 } // Aktifkan animasi ketika 30% dari elemen terlihat
    );

    const target = document.getElementById("image-sect");
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, []);

  const images = [
    {
      src: require("../../assets/img/ruang-rapat-2.png"),
      alt: "Ruang Rapat 2",
    },
    { src: require("../../assets/img/ruang-rapat.jpg"), alt: "Ruang Rapat 1" },
    { src: require("../../assets/img/halaman.png"), alt: "Halaman" },
  ];

  const [currentImages, setCurrentImages] = useState(images);

  const handleNext = () => {
    setCurrentImages((prevImages) => [
      prevImages[2],
      prevImages[0],
      prevImages[1],
    ]);
  };

  const handlePrev = () => {
    setCurrentImages((prevImages) => [
      prevImages[1],
      prevImages[2],
      prevImages[0],
    ]);
  };

  return (
    <div id="image-sect" className="image-section-wrapper">
      <div className="imgsec-container">
        <h1
          className={`text-center judul-imgsec ${
            playAnimation ? "fade-in" : ""
          }`}
        >
          SEWA BALAI DIKLAT <span>KOTA SEMARANG</span>
        </h1>
        <p
          className={`text-center desk-imgsec ${
            playAnimation ? "fade-in" : ""
          }`}
        >
          Selamat datang di Balai Diklat Pemerintah Kota Semarang, tempat ideal
          untuk berbagai kegiatan pelatihan, seminar, dan acara resmi. Dengan
          fasilitas modern, ruang yang luas, dan lokasi strategis, kami siap
          mendukung kesuksesan acara Anda. Dapatkan kenyamanan, keamanan, dan
          layanan terbaik di setiap kesempatan. Pesan sekarang dan rasakan
          pengalaman terbaik untuk kegiatan Anda!
        </p>
        <div className="section-images">
          <Container className="deskimg-cont">
            <Row className="justify-content-center align-items-center">
              <button className="carousel-control-prev" onClick={handlePrev}>
                <span className="carousel-control-icon">&#9664;</span>
              </button>
              {currentImages.map((image, index) => (
                <Col
                  md="auto"
                  key={index}
                  className={`carousel-img-wrapper ${
                    index === 1 ? "active-carousel-img" : ""
                  }`}
                >
                  <img
                    className={`carousel-img ${
                      index === 1 ? "active-img" : ""
                    }`}
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                  />
                </Col>
              ))}
              <button className="carousel-control-next" onClick={handleNext}>
                <span className="carousel-control-icon">&#9654;</span>
              </button>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default Images;

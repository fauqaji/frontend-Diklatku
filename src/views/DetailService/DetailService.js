import React, { useEffect, useState } from "react";
import axios from "axios";
import DetailServiceUpdate from "../../components/UpdateDS/DetailServiceUpdate";
import "../css/detail.css";

const DetailService = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);
  const [showModal, setShowModal] = useState(false); // State untuk modal
  const [selectedServiceId, setSelectedServiceId] = useState(null); // ID service yang akan di-update
 

  // Cek apakah token ada di localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch detail services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/detailService"
        );
        if (response.data.status === "sukses") {
          setServices(response.data.data);
        } else {
          setError("Gagal mengambil data");
        }
      } catch (error) {
        setError("Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            setPlayAnimation(true);
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.04 }
      );

      const target = document.getElementById("detail-sewa");
      if (target) {
        observer.observe(target);
      }

      return () => {
        if (target) {
          observer.unobserve(target);
        }
      };
    }
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = parseInt(entry.target.getAttribute("data-index"));
              setVisibleCards((prev) => [...prev, index]);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.267 }
      );

      const targets = document.querySelectorAll(".detail-card");
      targets.forEach((target, index) => {
        target.setAttribute("data-index", index);
        observer.observe(target);
      });

      return () => {
        targets.forEach((target) => observer.unobserve(target));
      };
    }
  }, [loading]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  // Handle update button click
  const handleUpdate = (id) => {
    setSelectedServiceId(id); // Set ID yang akan di-update
    setShowModal(true); // Tampilkan modal
  };

  const handlePesanSekarang = () => {
    window.open("https://wa.me/+62243586680", "_blank");
  };

  return (
    <div id="detail-sewa" className="container mt-4">
      <h1 className={`detail-jud-atas ${playAnimation ? "animate-slide" : ""}`}>
        UNIT YANG DISEWAKAN
      </h1>
      <hr className="garis-detail" />
      <div className="row">
        {services.map((service, index) => (
          <div
            className={`col-md-4 col-sm-6 mb-4 ${
              visibleCards.includes(index) ? "animate-card" : ""
            }`}
            key={service.detail_service_id}
          >
            <div className="detail-card h-100">
              <div className="card-img-atas position-relative">
                <img
                  src={(() => {
                    try {
                      const fotoArray = Array.isArray(service.foto)
                        ? service.foto
                        : JSON.parse(service.foto.replace(/&quot;/g, '"'));
                      return fotoArray[0] || "";
                    } catch {
                      return "";
                    }
                  })()}
                  alt={service.nama || "Foto tidak tersedia"}
                  className="card-img-custom"
                />
                <div className="card-img-overlay d-flex align-items-end text-white">
                  <h5 className="overlay-text">{service.nama}</h5>
                </div>
              </div>
              <div className="card-body card-body-detail">
                <div className="d-flex justify-content-between">
                  <p className="card-text harga-fasi">
                    Rp {service.harga.toLocaleString()}{" "}
                    <span className="harga-satuan">
                      <sub>
                        {service.nama === "Kamar" ? "/Kamar /Hari" : "/Hari"}
                      </sub>
                    </span>
                  </p>
                  <p className="card-text">
                    {[...Array(5)].map((_, index) => {
                      const fullStars = Math.floor(service.rating);
                      const hasHalfStar = service.rating - fullStars >= 0.5;
                      const showHalfStar = index === fullStars && hasHalfStar;

                      return (
                        <i
                          key={index}
                          className={
                            showHalfStar
                              ? "fa-solid fa-star-half text-warning icon-bint"
                              : index < fullStars
                              ? "fa-solid fa-star text-warning"
                              : "fa-regular fa-star"
                          }
                          style={{
                            color:
                              index < fullStars || showHalfStar
                                ? "#FFD700"
                                : "#ccc",
                          }}
                        ></i>
                      );
                    })}
                    <span className="text-warning"> {service.rating}</span>
                  </p>
                </div>
                <p className="jum-unit">{service.jumlah_kamar} Unit Ruang</p>
                <p className="card-text text-detail">{service.deskripsi}</p>
              </div>
              <div className="card-foo-detail text-center">
                {isLoggedIn ? (
                  <button
                    className="btn btn-update"
                    onClick={() => handleUpdate(service.detail_service_id)}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    className="btn btn-pesan"
                    onClick={handlePesanSekarang}
                  >
                    Pesan Sekarang
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal DetailServiceUpdate */}
      {showModal && (
        <DetailServiceUpdate
          show={showModal}
          handleClose={() => setShowModal(false)}
          id={selectedServiceId}
        />
      )}
    </div>
  );
};

export default DetailService;

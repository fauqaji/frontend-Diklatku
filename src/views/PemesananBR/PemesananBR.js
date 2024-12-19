import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/sidebar";
import UpdateBR from "../../components/UpdateBR/UpdateBR"; // Importing UpdateBR component
import "../css/PemesananBR.css";
import reschedule from "../../assets/img/reschedule.png";
import hapus from "../../assets/img/hapus.png";
import axios from "axios";

const PemesananBR = () => {
  const [bookingRooms, setBookingRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 6;
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false); // State for update modal
  const [deleteId, setDeleteId] = useState(null);
  const [bookingRoomId, setBookingRoomId] = useState(null); // State for storing the booking room ID to update
  const [buildingName, setBuildingName] = useState("");
  const [activeButton, setActiveButton] = useState("Semua");
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchBookingRooms = useCallback(
    async (name, page) => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/booking-rooms",
          {
            params: {
              buildingName: name || buildingName,
              page: page || currentPage,
              limit: itemsPerPage,
            },
          }
        );

        setBookingRooms(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err.message);
      }
    },
    [buildingName, currentPage, itemsPerPage]
  );

  useEffect(() => {
    fetchBookingRooms();
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // Jika token ada, set isLoggedIn ke true
    }
  }, [fetchBookingRooms]);
  // const handleSearchChange = (e) => {
  //   setSearchTerm(e.target.value);
  //   setCurrentPage(1);
  // };

  // const paginate = (pageNumber) => {
  //   if (pageNumber > 0 && pageNumber <= totalPages) {
  //     setCurrentPage(pageNumber);
  //   } else if (pageNumber > totalPages) {
  //     setCurrentPage(totalPages); // Set ke halaman terakhir
  //   } else {
  //     setCurrentPage(1); // Set ke halaman pertama jika pageNumber kurang dari 1
  //   }
  // };

  // const renderPagination = () => {
  //   const pageNumbers = [];
  //   const maxVisiblePages = 4;

  //   for (let i = 1; i <= totalPages; i++) {
  //     if (
  //       totalPages <= maxVisiblePages ||
  //       i === 1 ||
  //       i === totalPages ||
  //       (i >= currentPage - 1 && i <= currentPage + 1)
  //     ) {
  //       pageNumbers.push(i);
  //     } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
  //       pageNumbers.push("...");
  //     }
  //   }

  //   return pageNumbers.map((number, index) => (
  //     <li
  //       key={index}
  //       className={`page-item ${currentPage === number ? "active" : ""}`}
  //     >
  //       {number === "..." ? (
  //         <span className="page-link">{number}</span>
  //       ) : (
  //         <button onClick={() => paginate(number)} className="page-link">
  //           {number}
  //         </button>
  //       )}
  //     </li>
  //   ));
  // };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  // Function to handle update
  const handleUpdate = (id) => {
    setBookingRoomId(id); // Set the booking room ID
    setUpdateModalVisible(true); // Open the update modal
  };

  const handleDetail = (id) => {
    setBookingRoomId(id);
    navigate(`/pemesananBR/pemesanan-ruang`, {
      state: { bookingRoomDetail: id },
    });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/booking-rooms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedRooms = bookingRooms.filter(
        (room) => room.bookingRoomId !== id
      );
      setBookingRooms(updatedRooms);
      setShowModal(false); // Close the modal after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  const openModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeUpdateModal = () => {
    setUpdateModalVisible(false); // Close the update modal
    setBookingRoomId(null); // Clear the booking room ID
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFilter = (name) => {
    setBuildingName(name);
    setCurrentPage(1); // Reset ke halaman 1 saat filter berubah
    setActiveButton(name || "Semua");
    fetchBookingRooms(name, 1);
  };

  return (
    <div id="pemesanan-ruang" className="pemesanan-ruang-container">
      <Sidebar />
      <div className="pemesanan-ruang-content-container">
        <div className="container-pemesanan">
          {error && <p className="text-danger">{error}</p>}

          <div className="row">
            <div>
              <h1 className="mb-4 mt-4 text-start ">PEMESANAN AKTIF</h1>
            </div>
            <div>
              <nav className="d-flex justify-content-between my-2 nav-pem">
                <div className="button-group">
                  <button
                    className={`btn btn-secondary me-2 btn-ged ${
                      activeButton === "Semua" ? "active" : ""
                    }`}
                    onClick={() => handleFilter("")}
                  >
                    Semua
                  </button>
                  <button
                    className={`btn btn-secondary me-2 btn-ged ${
                      activeButton === "Gedung A" ? "active" : ""
                    }`}
                    onClick={() => handleFilter("Gedung A")}
                  >
                    Gedung A
                  </button>
                  <button
                    className={`btn btn-secondary me-2 btn-ged ${
                      activeButton === "Gedung B" ? "active" : ""
                    }`}
                    onClick={() => handleFilter("Gedung B")}
                  >
                    Gedung B
                  </button>
                  <button
                    className={`btn btn-secondary me-2 btn-ged ${
                      activeButton === "Gedung C" ? "active" : ""
                    }`}
                    onClick={() => handleFilter("Gedung C")}
                  >
                    Gedung C
                  </button>
                </div>
                <div className="button-nav">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="btn btn-primary me-1 btn-prene"
                  >
                    <i class="fa-solid fa-angle-left"></i>
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="btn btn-primary me-1 btn-prene"
                  >
                    <i class="fa-solid fa-angle-right"></i>
                  </button>
                </div>
              </nav>
            </div>

            {bookingRooms.length > 0 ? (
              bookingRooms.map((item) => (
                <div
                  className="col-md-4 mb-4 bag-card-pem"
                  key={item.bookingRoomId}
                >
                  <div className="card card-pem">
                    <div className="card-header d-flex justify-content-between head-card-pem">
                      <div>
                        <h5 className="mb-0">{item.buildingName}</h5>
                        <span className="text-muted">
                          {item.roomNumbers} Kamar Terpesan
                        </span>
                      </div>
                      <div className="icon-container">
                        <i
                          onClick={() => handleDetail(item.bookingRoomId)}
                          className="fa-solid fa-circle-info i-pem-info"
                        ></i>
                      </div>
                    </div>

                    <div className="card-body card-b-pem">
                      <div className="d-flex justify-content-between mb-3 align-items-center card-bper-pem">
                        <p>Jumlah Hari</p>
                        <span className="text-muted">{item.days} Hari</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div className="mb-2">
                          <p className="mb-1">Check In</p>
                          <span className="text-muted card-bket-pem">
                            {formatDate(item.startDate)}
                          </span>
                        </div>
                        <div className="mb-2 card-bket-pem">
                          <p className="mb-1">Check Out</p>
                          <span className="text-muted">
                            {formatDate(item.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isLoggedIn && (
                      <div className="card-footer d-flex justify-content-between btn-bwh-pem">
                        <button
                          onClick={() => handleUpdate(item.bookingRoomId)}
                          className="btn btn-secondary btn-sm btn-res-pem"
                        >
                          <img src={reschedule} alt="reschedule" /> Reschedule
                        </button>
                        <button
                          onClick={() => openModal(item.bookingRoomId)}
                          className="btn btn-danger btn-sm btn-hap-pem"
                        >
                          <img src={hapus} alt="hapus" /> Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p className="text-center">Tidak ada pemesanan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Confirmation */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="deleteConfirmationLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteConfirmationLabel">
                  Konfirmasi Penghapusan
                </h5>
                <button type="button" className="close" onClick={closeModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Apakah Anda yakin ingin menghapus pemesanan ini?
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary me-2 btn-bat-pbr"
                  onClick={closeModal}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-del-pbr"
                  onClick={() => {
                    handleDelete(deleteId);
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {updateModalVisible && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="updateModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="updateModalLabel">
                  Pilih Rentang Tanggal
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={closeUpdateModal}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <UpdateBR
                  bookingRoomId={bookingRoomId}
                  onClose={closeUpdateModal}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PemesananBR;

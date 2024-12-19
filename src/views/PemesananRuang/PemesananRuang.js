import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/PemesananRuang.css";
import axios from "axios";
import UpdateBR from "../../components/UpdateBR/UpdateBR";
import reschedule from "../../assets/img/reschedule.png";
import hapus from "../../assets/img/hapus.png";

const PemesananRuang = () => {
  const [bookingRooms, setBookingRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;
  const [error, setError] = useState(null);
  const location = useLocation();
  const { bookingRoomDetail } = location.state || {}; // Ambil data dari state
  const [bookingRoomId, setBookingRoomId] = useState(bookingRoomDetail || null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false); // State for update modal
  const [deleteId, setDeleteId] = useState(null);
  const [totalItems, settotalItems] = useState(0); // Nilai default 0
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchBookingRooms = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true); // Jika token ada, set isLoggedIn ke true
      }
      try {
        if (!bookingRoomId) return;
        const response = await axios.get(
          `http://localhost:3000/api/booking-details/${bookingRoomId}`,
          {
            params: {
              page: currentPage,
              limit: itemsPerPage,
              searchTerm,
            },
          }
        );
        settotalItems(response.data.totalItems);
        setBookingRooms(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBookingRooms();
  }, [currentPage, searchTerm, bookingRoomId]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else if (pageNumber > totalPages) {
      setCurrentPage(totalPages); // Set ke halaman terakhir
    } else {
      setCurrentPage(1); // Set ke halaman pertama jika pageNumber kurang dari 1
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 4;

    for (let i = 1; i <= totalPages; i++) {
      if (
        totalPages <= maxVisiblePages ||
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pageNumbers.push(i);
      } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
        pageNumbers.push("...");
      }
    }

    return pageNumbers.map((number, index) => (
      <li
        key={index}
        className={`page-item ${currentPage === number ? "active" : ""}`}
      >
        {number === "..." ? (
          <span className="page-link">{number}</span>
        ) : (
          <button onClick={() => paginate(number)} className="page-link">
            {number}
          </button>
        )}
      </li>
    ));
  };

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

  const handleUpdate = () => {
    setBookingRoomId(bookingRoomId); // Set the booking room ID
    setUpdateModalVisible(true); // Open the update modal
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
      setShowModal(false);
      navigate("/pemesananBR");
    } catch (err) {
      setError(err.message);
    }
  };

  const openModal = () => {
    setDeleteId(bookingRoomId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeUpdateModal = () => {
    setUpdateModalVisible(false); // Close the update modal
  };
  return (
    <div id="pemesanan-ruang" className="pemesanan-ruang-container">
      <Sidebar />
      <div className="pemesanan-ruang-content-container">
        <div className="container-pemesanan">
          <div className="d-flex align-items-center my-3">
            <i
              className="fa-solid fa-arrow-left i-pem-ruang me-2"
              onClick={() => navigate("/pemesananBR")}
            ></i>
            <h1 className="mb-0 text-start">DETAIL PEMESANAN AKTIF</h1>
          </div>
          <div className="mb-2 ">
            <input
              type="text"
              className="form-control search-input"
              placeholder="CARI NAMA RUANGAN"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="data-pem-ruang p-3">
            {error && <p className="text-danger">{error}</p>}

            {/* Tiga Kolom */}
            <div className="row mb-3 card-data-dlm">
              {/* Nama Gedung */}
              <h3 className="mb-2">
                {bookingRooms[0]?.Room?.Building?.name ||
                  "Nama Gedung Tidak Tersedia"}
              </h3>

              {/* Jumlah Hari, Jumlah Kamar, dan Tombol */}
              <div className="d-flex align-items-center justify-content-between">
                {/* Jumlah Hari dan Jumlah Kamar */}
                <div className="d-flex">
                  <div className="text-jum-pesan">
                    <p className="fw-bold mb-1">Jumlah Hari</p>
                    <span className="text-muted">
                      {bookingRooms[0]?.days || 0} Hari
                    </span>
                  </div>
                  <div>
                    <p className="fw-bold mb-1">Jumlah Kamar Terpesan</p>
                    <span className="text-muted">{totalItems} Kamar</span>
                  </div>
                </div>

                {/* Tombol Reschedule dan Hapus */}
                {isLoggedIn && (
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-warning btn-res-pemR"
                      onClick={() => handleUpdate()}
                    >
                      <img src={reschedule} alt="reschedule" /> Reschedule
                    </button>
                    <button
                      className="btn btn-danger btn-hap-pemR"
                      onClick={() => openModal(bookingRoomId)}
                    >
                      <img src={hapus} alt="hapus" /> Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Card Memanjang */}
            <div>
              {bookingRooms.length > 0 ? (
                bookingRooms.map((item, index) => (
                  <div key={index} className="card mb-2 card-data-bdetail">
                    <div className="card-body d-flex flex-wrap justify-content-between card-bdata-bdetail">
                      <div className="col-data col-bdata">
                        <p className="mb-1">
                          <strong>Nomor Ruangan</strong>
                        </p>
                        <p className="nmr-hur-pruang">
                          {item.Room?.room_number || "Tidak tersedia"}
                        </p>
                      </div>
                      <div className="col-data col-bdata">
                        <p className="mb-1">
                          <strong>Nomor Pesanan</strong>
                        </p>
                        <p className="nmr-hur-pruang">{item.nomor_pesanan} </p>
                      </div>
                      <div className="col-data col-bdata">
                        <p className="mb-1">
                          <strong>Check In</strong>
                        </p>
                        <p className="nmr-hur-pruang">
                          {item.BookingRoom?.Booking?.start_date
                            ? formatDate(item.BookingRoom.Booking.start_date)
                            : "Tidak tersedia"}
                        </p>
                      </div>
                      <div className="col-data col-bdata">
                        <p className="mb-1">
                          <strong>Check Out</strong>
                        </p>
                        <p className="nmr-hur-pruang">
                          {item.BookingRoom?.Booking?.end_date
                            ? formatDate(item.BookingRoom.Booking.end_date)
                            : "Tidak tersedia"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">Tidak ada data pemesanan</p>
              )}
            </div>
            <nav>
              <ul className="pagination justify-content-center my-2">
                {renderPagination()}
              </ul>
            </nav>
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
    </div>
  );
};

export default PemesananRuang;

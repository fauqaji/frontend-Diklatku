import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/sidebar";
import UpdateBR from "../../components/UpdateBR/UpdateBR"; // Importing UpdateBR component
import "../css/PemesananRuang.css";
import axios from "axios";

const PemesananRuang = () => {
  const [bookingRooms, setBookingRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false); // State for update modal
  const [deleteId, setDeleteId] = useState(null);
  const [bookingRoomId, setBookingRoomId] = useState(null); // State for storing the booking room ID to update

  useEffect(() => {
    const fetchBookingRooms = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/booking-rooms`,
          {
            params: {
              page: currentPage,
              limit: itemsPerPage,
              searchTerm,
            },
          }
        );
        setBookingRooms(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBookingRooms();
  }, [currentPage, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 4;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i <= maxVisiblePages ||
        i > totalPages - maxVisiblePages ||
        (currentPage >= maxVisiblePages &&
          currentPage <= totalPages - maxVisiblePages &&
          (i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)))
      ) {
        pageNumbers.push(i);
      } else if (pageNumbers[pageNumbers.length - 1] !== "...") {
        pageNumbers.push("...");
      }
    }

    return pageNumbers.map((number) => (
      <li
        key={number}
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

  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("id-ID", options);
  };

  // Function to handle update
  const handleUpdate = (id) => {
    setBookingRoomId(id); // Set the booking room ID
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
        (room) => room.booking_room_id !== id
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

  return (
    <div id="pemesanan-ruang" className="pemesanan-ruang-container">
      <Sidebar />
      <div className="pemesanan-ruang-content-container">
        <div className="container-pemesanan">
          <h1 className="mb-4 text-start">PEMESANAN AKTIF</h1>
          <div className="mb-2">
            <input
              type="text"
              className="form-control search-input"
              placeholder="CARI NAMA RUANGAN ATAU GEDUNG"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <table className="pemesanan-ruang-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Gedung</th>
                <th>Nama Ruangan</th>
                <th>Tanggal Mulai</th>
                <th>Tanggal Akhir</th>
                <th>Jumlah Hari</th>
                <th>Nomor Pesanan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookingRooms.length > 0 ? (
                bookingRooms.map((item, index) => (
                  <tr key={item.booking_room_id}>
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{item.Room.Building.name}</td>
                    <td>{item.Room.room_number}</td>
                    <td>{formatDate(item.Booking.start_date)}</td>
                    <td>{formatDate(item.Booking.end_date)}</td>
                    <td>{item.days} hari</td>
                    <td>{item.nomor_pesanan}</td>

                    <td>
                      <button
                        onClick={() => handleUpdate(item.booking_room_id)} // Handle update button click
                        className="btn btn-secondary me-1"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => openModal(item.booking_room_id)}
                        className="btn btn-danger"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <nav>
            <ul className="pagination justify-content-center my-2">
              {renderPagination()}
            </ul>
          </nav>
        </div>

        {/* Bootstrap Modal for Confirmation */}
        {showModal && (
          <div
            className="modal fade show"
            style={{ display: "block" }} // To make the modal visible
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
                    className="btn btn-secondary me-2"
                    onClick={closeModal}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
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

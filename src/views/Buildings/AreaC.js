import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar/sidebar";
import UpdateClass from "../../components/UpdateClass/UpdateClass";
import Modal from "react-bootstrap/Modal";
import "../css/areaC.css";

const AreaC = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      const roomIds = selectedRooms;

      const response = await axios.get(
        "http://localhost:3000/api/rooms/buildings/3",
        {
          params: { room_ids: roomIds },
        }
      );

      if (Array.isArray(response.data.data)) {
        const sortedRooms = response.data.data.sort((a, b) => {
          return (
            parseInt(a.room_number.substring(1)) -
            parseInt(b.room_number.substring(1))
          );
        });

        // Mapping updated rooms with necessary properties
        const updatedRooms = sortedRooms.map((room) => ({
          ...room,
          booking_room_id: room.booking_room_id || null,
          status_name: room.status_name || "unknown",
        }));

        setRooms(updatedRooms);
      } else {
        console.error("Data from API is not in array format:", response.data);
        setRooms([]);
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
      setRooms([]);
    }
  }, [selectedRooms]); // Include selectedRooms in dependency array for fetchRooms

  useEffect(() => {
    if (selectedRooms.length > 0) {
      fetchRooms();
    }
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // Jika token ada, set isLoggedIn ke true
    }
    const intervalId = setInterval(() => {
      fetchRooms();
    }, 100);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [selectedRooms, fetchRooms]);

  useEffect(() => {
    setShowFloatingButton(selectedRooms.length > 0);
  }, [selectedRooms]);

  const toggleRoomSelection = (roomId) => {
    if (!isLoggedIn) {
      return; // Tidak melakukan apa-apa jika belum login
    }
    setSelectedRooms((prevSelected) => {
      if (prevSelected.includes(roomId)) {
        return prevSelected.filter((id) => id !== roomId);
      } else {
        return [...prevSelected, roomId];
      }
    });
  };

  const handleFloatingButtonClick = () => {
    if (!isLoggedIn) {
      return; // Tidak melakukan apa-apa jika belum login
    }
    setShowModal(true);
  };

  const getBackgroundColor = (status) => {
    switch (status) {
      case "available":
        return "#69BF25";
      case "not_available":
        return "#BF252B33";
      case "booked":
        return "#BF252B";
      default:
        return "#f8f9fa";
    }
  };

  const getTextColor = (status) => {
    return status === "not_available" ? "black" : "white";
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "available":
        return <span style={{ fontSize: "0.84rem" }}>Tersedia</span>;
      case "not_available":
        return <span style={{ fontSize: "0.84rem" }}>Tidak Tersedia</span>;
      case "booked":
        return <span style={{ fontSize: "0.84rem" }}>Terpakai</span>;
      default:
        return <span style={{ fontSize: "0.84rem" }}></span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return (
          <i className="fa-solid fa-circle" style={{ color: "#69BF25" }}></i>
        );
      case "not_available":
        return (
          <i
            className="fa-solid fa-circle"
            style={{ color: "#BF252B", opacity: "20%" }}
          ></i>
        );
      case "booked":
        return (
          <i className="fa-solid fa-circle" style={{ color: "#BF252B" }}></i>
        );
      default:
        return <i className="fa-solid fa-question-circle"></i>;
    }
  };

  const handleCancelButtonClick = () => {
    setSelectedRooms([]); // Mengosongkan pilihan kamar
    setShowModal(false); // Menutup modal jika terbuka
  };

  const getRoomStatusCount = (filteredRooms) => {
    return filteredRooms.reduce(
      (acc, room) => {
        if (room.status_name === "available") {
          acc.available += 1;
        } else if (room.status_name === "not_available") {
          acc.not_available += 1;
        } else if (room.status_name === "booked") {
          acc.booked += 1;
        }
        return acc;
      },
      { available: 0, not_available: 0, booked: 0 }
    );
  };

  const handleRoomClick = (room) => {
    toggleRoomSelection(room.room_id);
  };

  // Map untuk mengganti nama room_number dengan nama baru
  const roomNameMap = {
    RRKecilA: "R. Rapat Kecil A",
    RRKecilB: "R. Rapat Kecil B",
    RRBesarC: "R. Rapat Besar C",
    RRBesarAB: "R. Rapat Besar AB",
    GPABC: "Gedung Pertemuan ABC",
  };

  const desiredOrder = [
    "R. Rapat Kecil A",
    "R. Rapat Kecil B",
    "R. Rapat Besar AB",
    "R. Rapat Besar C",
    "Gedung Pertemuan ABC",
  ];

  // Filter ruangan dengan awalan "RR" atau "GP" dan ganti namanya
  const kelas = rooms
    .filter(
      (room) =>
        room.room_number.startsWith("RR") || room.room_number.startsWith("GP")
    )
    .map((room) => ({
      ...room,
      room_name: roomNameMap[room.room_number] || room.room_number, // Ganti nama jika ada di map
    }))
    .sort(
      (a, b) =>
        desiredOrder.indexOf(a.room_name) - desiredOrder.indexOf(b.room_name)
    );

  const lapanganRT = rooms
    .filter(
      (room) =>
        room.room_number === "Lapangan" || room.room_number === "R.Transit"
    )
    .sort((a, b) => {
      if (a.room_number === "Lapangan" && b.room_number !== "Lapangan")
        return -1;
      if (a.room_number !== "Lapangan" && b.room_number === "Lapangan")
        return 1;
      return 0;
    });

  const statusA = getRoomStatusCount(kelas);
  const statusB = getRoomStatusCount(lapanganRT);

  const getUpdatedRoomName = (room_number) => {
    if (room_number === "R.Transit") {
      return "Ruang Transit";
    }
    return room_number; // Jika nama tidak dikenali, kembalikan nama aslinya
  };

  return (
    <div id="areaC" className="areaC-container areaC-con">
      <Sidebar />
      <div className="contentC-container">
        <div className="container mt-4">
          <h1 className="mb-2 my-3 text-start">
            MONITORING R.RAPAT KECIL, R.RAPAT BESAR, & GEDUNG PERTEMUAN
          </h1>
          <div className="d-flex justify-content-between align-items-center">
            <p className="ms-2">
              R.Rapat Kecil, R.Rapat Besar, Gedung Pertemuan
            </p>
            <div className="d-flex align-items-center gd-c">
              {Object.keys(statusA).map((status) => (
                <div className="d-flex align-items-center me-3" key={status}>
                  <span className="me-2">{getStatusIcon(status)}</span>
                  <span className="me-2">{statusA[status]}</span>
                  <span>{getStatusLabel(status)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="roomC-container">
            {kelas.length > 0 ? (
              kelas.map((room) => (
                <div
                  key={room.room_id}
                  className={`roomC-box ${
                    selectedRooms.includes(room.room_id) ? "selected" : ""
                  }`}
                  style={{
                    background: getBackgroundColor(room.status_name),
                    color: getTextColor(room.status_name),
                  }}
                  onClick={() => handleRoomClick(room)}
                >
                  {selectedRooms.includes(room.room_id) && (
                    <i className="fa-solid fa-circle-check check-icon"></i>
                  )}
                  <h5 className="hur-room">{room.room_name}</h5>
                </div>
              ))
            ) : (
              <p>Tidak ada data fasilitas yang tersedia.</p>
            )}
          </div>

          <h1 className="mb-2 my-3 text-start">
            MONITORING LAPANGAN & RUANG TRANSIT
          </h1>
          <div className="d-flex justify-content-between align-items-center">
            <p className="ms-2">Lapangan & Ruang Transit</p>
            <div className="d-flex align-items-center gd-c">
              {Object.keys(statusB).map((status) => (
                <div className="d-flex align-items-center me-3" key={status}>
                  <span className="me-2">{getStatusIcon(status)}</span>
                  <span className="me-2">{statusB[status]}</span>
                  <span>{getStatusLabel(status)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="roomC-container">
            {lapanganRT.length > 0 ? (
              lapanganRT.map((room) => (
                <div
                  key={room.room_id}
                  className={`roomC-box ${
                    selectedRooms.includes(room.room_id) ? "selected" : ""
                  }`}
                  style={{
                    background: getBackgroundColor(room.status_name),
                    color: getTextColor(room.status_name),
                  }}
                  onClick={() => handleRoomClick(room)}
                >
                  {selectedRooms.includes(room.room_id) && (
                    <i className="fa-solid fa-circle-check check-icon"></i>
                  )}
                  <h5 className="hur-room">
                    {getUpdatedRoomName(room.room_number)}
                  </h5>
                </div>
              ))
            ) : (
              <p>
                Tidak ada data ruang Lapangan atau Ruang Transit yang tersedia.
              </p>
            )}
          </div>

          {/* Floating Button */}
          {showFloatingButton && (
            <div className="d-flex justify-content-center fixed-bottom mb-3 ">
              <button
                className="btn me-2 meB-2 btn-mult"
                onClick={handleCancelButtonClick}
              >
                Batal
              </button>
              <button
                className="btn btn-mult-stat"
                onClick={handleFloatingButtonClick}
              >
                Pesan Kamar
              </button>
            </div>
          )}
          {/* Modal */}
          {isLoggedIn && (
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Perbarui Status</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedRooms.length > 0 ? (
                  <UpdateClass
                    selectedRooms={selectedRooms} // Kirim daftar kamar ke komponen UpdateClass
                    rooms={rooms}
                    onClose={() => {
                      setShowModal(false);
                      setSelectedRooms([]); // Reset daftar kamar setelah modal ditutup
                    }}
                  />
                ) : (
                  <p>Tidak ada kamar yang dipilih.</p>
                )}
              </Modal.Body>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default AreaC;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar/sidebar";
import UpdateClass from "../../components/UpdateClass/UpdateClass";
import Modal from "react-bootstrap/Modal";
import "../css/areaC.css";

const AreaC = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/rooms/buildings/3"
      );

      if (
        response.data.status === "success" &&
        Array.isArray(response.data.data)
      ) {
        // Mengurutkan data ruangan berdasarkan nomor ruangan
        const sortedRooms = response.data.data.sort((a, b) => {
          return a.room_number.localeCompare(b.room_number);
        });
        setRooms(sortedRooms);
      } else {
        console.error("Data tidak valid:", response.data);
        setRooms([]);
      }
    } catch (error) {
      console.error("Error fetching rooms data:", error);
      setRooms([]);
    }
  };

  useEffect(() => {
    fetchRooms();
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // Jika token ada, set isLoggedIn ke true
    }

    const intervalId = setInterval(() => {
      fetchRooms();
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

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
    const token = localStorage.getItem("token");
    if (token) {
      setSelectedRoom(room);
      setShowModal(true);
    } else {
      return 0;
    }
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

  const lapanganRT = rooms.filter(
    (room) =>
      room.room_number === "Lapangan" || room.room_number === "R.Transit"
  );
  const statusA = getRoomStatusCount(kelas);
  const statusB = getRoomStatusCount(lapanganRT);

  const getUpdatedRoomName = (room_number) => {
    if (room_number === "Lapangan") {
      return "Lapangan";
    } else if (room_number === "R.Transit") {
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
            <div className="d-flex align-items-center">
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
                  className="roomC-box"
                  style={{
                    background: getBackgroundColor(room.status_name),
                    color: getTextColor(room.status_name),
                  }}
                  onClick={() => handleRoomClick(room)}
                >
                  <h5>{room.room_name}</h5>
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
            <div className="d-flex align-items-center">
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
                  className="roomC-box"
                  style={{
                    background: getBackgroundColor(room.status_name),
                    color: getTextColor(room.status_name),
                  }}
                  onClick={() => handleRoomClick(room)}
                >
                  <h5>{getUpdatedRoomName(room.room_number)}</h5>
                </div>
              ))
            ) : (
              <p>
                Tidak ada data ruang Lapangan atau Ruang Transit yang tersedia.
              </p>
            )}
          </div>

          {/* Modal */}
          {isLoggedIn && (
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Perbarui Status</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedRoom && (
                  <UpdateClass
                    room={selectedRoom}
                    bookingRoomId={selectedRoom.booking_room_id} // Jika ada
                    onClose={() => setShowModal(false)}
                  />
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

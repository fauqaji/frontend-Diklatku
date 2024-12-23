import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar/sidebar";
import "../css/gedungA.css";
import Modal from "react-bootstrap/Modal";
import UpdateClass from "../../components/UpdateClass/UpdateClass";

const GedungA = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      const roomIds = selectedRooms;

      const response = await axios.get(
        "/api/rooms/buildings/1",
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

  const filterRoomsByRange = (prefix, start, end) => {
    return rooms.filter((room) => {
      const number = parseInt(room.room_number.substring(1));
      return (
        room.room_number.startsWith(prefix) && number >= start && number <= end
      );
    });
  };

  const roomsA = filterRoomsByRange("A", 101, 112);
  const roomsB = filterRoomsByRange("A", 201, 213);
  const roomsC = filterRoomsByRange("A", 301, 313);

  const statusA = getRoomStatusCount(roomsA);
  const statusB = getRoomStatusCount(roomsB);
  const statusC = getRoomStatusCount(roomsC);

  const handleRoomClick = (room) => {
    toggleRoomSelection(room.room_id);
  };

  return (
    <div id="gedungA" className="gedungA-container gedA-con">
      <Sidebar />
      <div className="content-container">
        <div className="container mt-4">
          <h1 className="mb-2 my-3 text-start">MONITORING GEDUNG A</h1>

          {/* Lantai 1 */}
          <div className="d-flex justify-content-between align-items-center">
            <p className="ms-2">Lantai 1 Kamar A101 - A112</p>
            <div className="d-flex align-items-center gd-a">
              {Object.keys(statusA).map((status) => (
                <div className="d-flex align-items-center me-3" key={status}>
                  <span className="me-2">{getStatusIcon(status)}</span>
                  <span className="me-2">{statusA[status]}</span>
                  <span>{getStatusLabel(status)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="room-container">
            {roomsA.length > 0 ? (
              roomsA.map((room) => (
                <div
                  key={room.room_id}
                  className={`room-box ${
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
                  <h5>{`${room.room_number}`}</h5>
                </div>
              ))
            ) : (
              <p>Tidak ada data kamar yang tersedia.</p>
            )}
          </div>

          {/* Lantai 2 */}
          <div className="d-flex justify-content-between align-items-center">
            <p className="ms-2">Lantai 2 Kamar A201 - A213</p>
            <div className="d-flex align-items-center gd-a">
              {Object.keys(statusB).map((status) => (
                <div className="d-flex align-items-center me-3" key={status}>
                  <span className="me-2">{getStatusIcon(status)}</span>
                  <span className="me-2">{statusB[status]}</span>
                  <span>{getStatusLabel(status)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="room-container">
            {roomsB.length > 0 ? (
              roomsB.map((room) => (
                <div
                  key={room.room_id}
                  className={`room-box ${
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
                  <h5>{`${room.room_number}`}</h5>
                </div>
              ))
            ) : (
              <p>Tidak ada data kamar yang tersedia.</p>
            )}
          </div>

          {/* Lantai 3 */}
          <div className="d-flex justify-content-between align-items-center">
            <p className="ms-2">Lantai 3 Kamar A301 - A313</p>
            <div className="d-flex align-items-center gd-a">
              {Object.keys(statusC).map((status) => (
                <div className="d-flex align-items-center me-3" key={status}>
                  <span className="me-2">{getStatusIcon(status)}</span>
                  <span className="me-2">{statusC[status]}</span>
                  <span>{getStatusLabel(status)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="room-container">
            {roomsC.length > 0 ? (
              roomsC.map((room) => (
                <div
                  key={room.room_id}
                  className={`room-box ${
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
                  <h5>{`${room.room_number}`}</h5>
                </div>
              ))
            ) : (
              <p>Tidak ada data kamar yang tersedia.</p>
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

export default GedungA;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../components/Sidebar/sidebar"; 
import "../css/gedungB.css"; 
import UpdateClass from "../../components/UpdateClass/UpdateClass";
import Modal from "react-bootstrap/Modal";

const GedungB = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/rooms/buildings/2"
      );
      if (Array.isArray(response.data.data)) {
        const sortedRooms = response.data.data.sort((a, b) => {
          return (
            parseInt(a.room_number.substring(1)) -
            parseInt(b.room_number.substring(1))
          );
        });

        // Menyimpan booking_room_id ke dalam state rooms
        const updatedRooms = sortedRooms.map((room) => ({
          ...room,
          booking_room_id: room.booking_room_id || null, // Atau cara lain untuk mengambil booking_room_id jika diperlukan
        }));

        setRooms(updatedRooms);
      } else {
        console.error("Data dari API tidak berbentuk array:", response.data);
        setRooms([]);
      }
    } catch (error) {
      console.error("Error fetching rooms data:", error);
      setRooms([]);
    }
  };

  useEffect(() => {
    fetchRooms(); // Fetch data on component mount
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // Jika token ada, set isLoggedIn ke true
    }

    const intervalId = setInterval(() => {
      fetchRooms(); // Fetch data every 5 seconds (5000 ms)
    }, 2000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
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

  const filterRoomsByRange = (prefix, start, end) => {
    return rooms.filter((room) => {
      const number = parseInt(room.room_number.substring(1));
      return (
        room.room_number.startsWith(prefix) && number >= start && number <= end
      );
    });
  };

  const roomsA = filterRoomsByRange("B", 101, 112);
  const roomsB = filterRoomsByRange("B", 201, 213);
  const roomsC = filterRoomsByRange("B", 301, 313);

  const statusA = getRoomStatusCount(roomsA);
  const statusB = getRoomStatusCount(roomsB);
  const statusC = getRoomStatusCount(roomsC);

  const handleRoomClick = (room) => {
    const token = localStorage.getItem("token");
    if (token) {
      setSelectedRoom(room);
      setShowModal(true);
    } else {
      return 0;
    }
  };

  return (
    <div id="gedungB" className="gedungB-container gedB-con">
      <Sidebar /> {/* Sidebar component */}
      <div className="content-container">
        <div className="container mt-4">
          <h1 className="mb-2 my-3 text-start">MONITORING GEDUNG B</h1>
          {/* Lantai 1 */}
          <div className="d-flex justify-content-between align-items-center">
            <p className="ms-2">Lantai 1 Kamar B101 - B112</p>
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
          <div className="room-container">
            {roomsA.length > 0 ? (
              roomsA.map((room) => (
                <div
                  key={room.room_id}
                  className="room-box"
                  style={{
                    background: getBackgroundColor(room.status_name),
                    color: getTextColor(room.status_name),
                  }}
                  onClick={() => handleRoomClick(room)}
                >
                  <h5>{`${room.room_number}`}</h5>
                </div>
              ))
            ) : (
              <p>Tidak ada data kamar yang tersedia.</p>
            )}
          </div>

          {/* Lantai 2 */}
          <div className="d-flex justify-content-between align-items-center">
            <p className="ms-2">Lantai 2 Kamar B201 - B213</p>
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
          <div className="room-container">
            {roomsB.length > 0 ? (
              roomsB.map((room) => (
                <div
                  key={room.room_id}
                  className="room-box"
                  style={{
                    background: getBackgroundColor(room.status_name),
                    color: getTextColor(room.status_name),
                  }}
                  onClick={() => handleRoomClick(room)}
                >
                  <h5>{`${room.room_number}`}</h5>
                </div>
              ))
            ) : (
              <p>Tidak ada data kamar yang tersedia.</p>
            )}
          </div>

          {/* Lantai 3 */}
          <div className="d-flex justify-content-between align-items-center">
            <p className="ms-2">Lantai 3 Kamar B301 - B313</p>
            <div className="d-flex align-items-center">
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
                  className="room-box"
                  style={{
                    background: getBackgroundColor(room.status_name),
                    color: getTextColor(room.status_name),
                  }}
                  onClick={() => handleRoomClick(room)}
                >
                  <h5>{`${room.room_number}`}</h5>
                </div>
              ))
            ) : (
              <p>Tidak ada data kamar yang tersedia.</p>
            )}
          </div>

          {/* Modal */}
          {isLoggedIn && (<Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Perbarui Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedRoom && (
                <UpdateClass
                  room={selectedRoom}
                  bookingRoomId={selectedRoom.booking_room_id} // Tambahkan booking_room_id jika diperlukan
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

export default GedungB;

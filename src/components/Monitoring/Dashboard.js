import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../Sidebar/sidebar";
import "./dashboard.css";
import ABuilding from "../../assets/img/ABuilding.png";
import BBuilding from "../../assets/img/BBuilding.png";
import Class from "../../assets/img/class.png";

const Dashboard = () => {
  const [buildings, setBuildings] = useState([]);
  const [roomsC, setRoomsC] = useState([]);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch buildings data
    const fetchBuildings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/buildingsMon"
        );
        if (response.data && response.data.data) {
          setBuildings(response.data.data.slice(0, 3));
        } else {
          setError("Data is undefined");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchRoomsC = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/rooms/buildings/3"
        );
        setRoomsC(response.data.data); // Simpan data rooms ke state
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchHistory = async () => {
      
      try {
        setHistory([]);
        const response = await axios.get("http://localhost:3000/api/history", {
          params: {
            page: currentPage,
            limit: itemsPerPage, // Kirim jumlah item per halaman
            searchTerm, // Anda bisa tetap menggunakan searchTerm untuk pencarian jika diperlukan
          },
        });

        setHistory(response.data.data); // Set data dari server
        setTotalPages(response.data.totalPages); // Set total halaman dari server
      } catch (err) {
        setError(err.message);
      } 
    };

    fetchBuildings();
    fetchRoomsC();
    fetchHistory();
  }, [currentPage, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "text-success";
      case "not_available":
        return "text-secondary";
      case "booked":
        return "text-warning";
      default:
        return "text-dark";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <i className="fa-solid fa-circle"></i>;
      case "not_available":
        return <i className="fa-solid fa-circle"></i>;
      case "booked":
        return <i className="fa-solid fa-circle"></i>;
      default:
        return <i className="fa-solid fa-question-circle"></i>;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "available":
        return "Tersedia";
      case "not_available":
        return "Tidak Tersedia";
      case "booked":
        return "Terpakai";
      default:
        return "Status Tidak Diketahui";
    }
  };

  const getBuildingName = (buildingName) => {
    switch (buildingName) {
      case "Gedung A":
        return "GEDUNG ASRAMA A";
      case "Gedung B":
        return "GEDUNG ASRAMA B";
      case "Gedung C":
        return "LAINNYA";
      default:
        return "Tidak Tersedia";
    }
  };

  const getBuildingImage = (buildingName) => {
    switch (buildingName) {
      case "Gedung A":
        return ABuilding;
      case "Gedung B":
        return BBuilding;
      case "Gedung C":
        return Class;
      default:
        return null;
    }
  };

  const getBuildingCardClass = (buildingName) => {
    switch (buildingName) {
      case "Gedung A":
        return "card-gedung-a";
      case "Gedung B":
        return "card-gedung-b";
      case "Gedung C":
        return "card-gedung-c";
      default:
        return "card-default";
    }
  };

  const handleNavigate = (buildingName) => {
    switch (buildingName) {
      case "Gedung A":
        navigate("/gedungA");
        break;
      case "Gedung B":
        navigate("/gedungB");
        break;
      case "Gedung C":
        navigate("/areaC");
        break;
      default:
        console.log("Gedung tidak dikenal");
    }
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
  // Total pages calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

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

  // Fungsi untuk menangani perubahan input search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("id-ID", options);
  };

  if (error) return <div className="alert alert-danger">Error: {error}</div>;
  
  return (
    <div id="AllBuilding" className="dashboard-container dash-con">
      <Sidebar />
      <div className="content-container">
        <div className="container cont-dash-spe">
          <h1 className="mb-2 my-1 text-start">MONITORING GEDUNG</h1>
          <div className="row">
            {buildings?.length > 0 ? (
              buildings.map((building) => (
                <div className="col-md-4 mb-1" key={building.building_id}>
                  <div
                    className={`card card-dash ${getBuildingCardClass(
                      building.building_name
                    )}`}
                  >
                    <img
                      src={getBuildingImage(building.building_name)}
                      className="card-img-top"
                      alt={building.building_name}
                    />
                    <div className="card-body d-flex flex-column">
                      <div className="status-container flex-grow-1">
                        <h5 className="card-title mb-3 font-weight-bold">
                          {getBuildingName(building.building_name)}
                        </h5>
                        {building.building_name === "Gedung C" ? (
                          <div className="d-flex room-list">
                            {roomsC
                              .sort((a, b) =>
                                a.room_number.localeCompare(b.room_number)
                              )
                              .map((room, index) => (
                                <span
                                  key={`${room.room_id}-${index}`}
                                  className="room-item"
                                >
                                  {room.room_number}
                                  {index < roomsC.length - 1 ? ", " : ""}
                                </span>
                              ))}
                          </div>
                        ) : (
                          Object.keys(building.room_status).map((status) => (
                            <div
                              className="d-flex align-items-center mb-1 ml-3"
                              key={status}
                            >
                              <span
                                className={`${getStatusColor(status)} me-2`}
                              >
                                {getStatusIcon(status)}
                              </span>
                              <span className="me-2">
                                {building.room_status[status]?.count}
                              </span>
                              <span>{getStatusLabel(status)}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="card-foo">
                      <i
                        className="fa-solid fa-arrow-right icon-size"
                        onClick={() => handleNavigate(building.building_name)}
                        style={{ cursor: "pointer" }}
                      ></i>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Tidak ada data gedung.</p>
            )}
          </div>

          <h1 className="mb-2 text-start">RIWAYAT PEMESANAN</h1>
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Cari nama gedung atau nama ruangan"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {error && <p className="text-danger">{error}</p>}

          <table className="table table-bord">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Bangunan</th>
                <th>Nama Ruangan</th>
                <th>Tanggal Mulai</th>
                <th>Tanggal Akhir</th>
                <th>Jumlah Hari</th>
              </tr>
            </thead>
            <tbody>
            {history.length > 0 ? (
              history.map((item, index) => (
                <tr key={item.booking_room_id || index}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{item.Room?.Building?.name || "Tidak Tersedia"}</td>
                  <td>{item.Room?.room_number || "Tidak Tersedia"}</td>
                  <td>{formatDate(item.start_date)}</td>
                  <td>{formatDate(item.end_date)}</td>
                  <td>{item.days} hari</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  Tidak ada pemesanan
                </td>
              </tr>
            )}
            </tbody>
          </table>

          <nav>
            <ul className="pagination justify-content-center">
              {renderPagination()}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

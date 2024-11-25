import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UpdateClass = ({ room, onClose }) => {
  const [statusId, setStatusId] = useState(room ? room.status_id : 1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookingRoomId] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  const statusOptions = [
    { id: 1, label: "Tersedia" },
    { id: 2, label: "Tidak Tersedia" },
    { id: 3, label: "Terpakai" },
  ];

  // Fetch tanggal yang sudah dibooking saat room_id tersedia
  useEffect(() => {
    const fetchBookingRoom = async () => {
      if (room?.room_id) {
        try {
          const token = localStorage.getItem("token");
          const headers = { Authorization: `Bearer ${token}` };

          // Fetch tanggal booking berdasarkan room_id
          const response = await axios.get(
            `http://localhost:3000/api/booking-rooms/cektanggal/${room.room_id}`,
            { headers }
          );
          const bookedDatesData = response.data.data.map(
            ({ start_date, end_date }) => ({
              start: new Date(start_date),
              end: new Date(end_date),
            })
          );
          setBookedDates(bookedDatesData); // Simpan tanggal yang sudah dibooking
        } catch (error) {
          console.error("Gagal mengambil tanggal booking.", error);
        }
      }
    };

    fetchBookingRoom();
  }, [room]);

  // Fungsi untuk menampilkan hanya tanggal yang tidak memiliki start_date dan end_date
  const filterDates = (date) => {
    // Ambil tanggal dari date
    const targetDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    // Periksa apakah tanggal tersebut ada dalam daftar bookedDates
    return bookedDates.every(({ start, end }) => {
      const startDate = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate()
      );
      const endDate = new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate()
      );
      return (
        targetDate.getTime() !== startDate.getTime() &&
        targetDate.getTime() !== endDate.getTime() &&
        (targetDate < startDate || targetDate > endDate)
      );
    });
  };

  const handleStatusChange = (id) => {
    if (
      (room.status_name === "available" && id === 1) ||
      (room.status_name === "not_available" && id === 2)
    ) {
      toast.warning("Status Ruangan Saat Ini.");
      return;
    }

    if (id !== statusId) {
      setStatusId(id);
      if (id !== 3) {
        setStartDate(null);
        setEndDate(null);
      }
    }
  };

  const handleSave = async () => {
    if (!room || !room.room_id) {
      toast.error("Ruangan tidak valid. Silakan coba lagi.");
      return;
    }

    if (statusId === 3 && (!startDate || !endDate)) {
      toast.error("Tanggal tidak boleh kosong saat ruangan terpakai.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (statusId === 1 || statusId === 2) {
        if (bookingRoomId) {
          await axios.delete(
            `http://localhost:3000/api/booking-rooms/${bookingRoomId}`,
            { headers }
          );
          console.log(`Booking room with ID ${bookingRoomId} deleted.`);
        }

        await axios.put(
          `http://localhost:3000/api/rooms/${room.room_id}`,
          { status_id: statusId },
          { headers }
        );
        toast.success("Status ruangan berhasil diperbarui.");
      } else if (statusId === 3) {
        const bookingData = {
          room_id: room.room_id,
          start_date: startDate.toISOString(), // Mengirim dengan waktu yang tepat (UTC)
          end_date: endDate.toISOString(), // Mengirim dengan waktu yang tepat (UTC)
        };

        await axios.post(
          `http://localhost:3000/api/booking-rooms`,
          bookingData,
          { headers }
        );
        toast.success("Booking baru berhasil dibuat.");
      }

      onClose();
    } catch (error) {
      toast.error(
        `Gagal menyimpan data: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  return (
    <div>
      <h2>{room.room_number}</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Status Kelas</Form.Label>
          <div className="d-flex justify-content-between">
            {statusOptions.map((status) => (
              <div
                key={status.id}
                className={`status-option ${
                  status.id === statusId ? "active" : ""
                }`}
                onClick={() => handleStatusChange(status.id)}
                style={{
                  cursor:
                    status.id === room.status_id ? "not-allowed" : "pointer",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  flex: 1,
                  textAlign: "center",
                  margin: "0 5px",
                  backgroundColor:
                    status.id === statusId ? "#007bff" : "transparent",
                  color: status.id === statusId ? "#fff" : "#000",
                  opacity: status.id === room.status_id ? 0.5 : 1,
                }}
              >
                {status.label}
              </div>
            ))}
          </div>
        </Form.Group>

        {statusId === 3 && (
          <Form.Group>
            <Form.Label>Pilih Rentang Tanggal</Form.Label>
            <div className="d-flex justify-content-center">
              <DatePicker
                selected={startDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setStartDate(start);
                  setEndDate(end);
                }}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                dateFormat="dd/MM/yyyy"
                filterDate={filterDates}
                minDate={new Date()}
              />
            </div>
          </Form.Group>
        )}

        <div className="d-flex justify-content-center mt-3">
          <Button variant="primary" onClick={handleSave} className="mx-1">
            Simpan
          </Button>
          <Button variant="secondary" onClick={onClose} className="mx-1">
            Batal
          </Button>
        </div>
      </Form>
      <ToastContainer
        position="top-right"
        autoClose={2400}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default UpdateClass;
